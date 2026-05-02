document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsArea = document.getElementById('results-area');
    const aiContent = document.getElementById('ai-content');
    const webContent = document.getElementById('web-content');
    const logoContainer = document.querySelector('.logo-container');

    // Logo Click to Home
    logoContainer.addEventListener('click', () => {
        location.reload();
    });

    // Game Cards Accordion Logic
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            // Close other cards
            gameCards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            // Toggle clicked card
            card.classList.toggle('active');
        });
    });

    // Base64 Encoded API Keys
    const encodedGroqKey = "Z3NrX280QkJRcWxVMElHUjJpd3pWZ0prV0dkeWIzRlkxUjA0bDE1RTZRQ2Z2WnVNOWJTalZhNzM="; 
    const encodedTavilyKey = "dHZseS1kZXYtM2xsQmFlLXppTUdvVlVrdmF0R1NHUVNINjNpYkJiYzI3Z1FKZ2g5MG5lSVFVNjlKVQ==";
    
    let currentApiKey = "";
    let tavilyApiKey = "";
    try {
        currentApiKey = atob(encodedGroqKey);
        tavilyApiKey = atob(encodedTavilyKey);
    } catch(e) {
        console.error("Base64 decode error");
    }

    // Handle Search
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        // UI Updates
        logoContainer.classList.add('mini-logo'); // Shrink logo instead of hiding
        const gamesSection = document.getElementById('games-section');
        if (gamesSection) gamesSection.style.display = 'none';
        resultsArea.classList.remove('hidden');
        aiContent.innerHTML = '<div class="loading-spinner"></div>';
        webContent.innerHTML = '<div class="loading-spinner"></div>';

        // Fetch Web Results first, then pass to AI
        const searchSource = document.getElementById('search-source') ? document.getElementById('search-source').value : 'web';
        const sectionTitle = document.querySelector('.web-results-section h3');
        let searchContext = '';
        
        if (searchSource === 'wikipedia') {
            if (sectionTitle) sectionTitle.innerHTML = '📚 Wikipedia Results';
            searchContext = await fetchWikipediaResults(query);
        } else if (searchSource === 'images') {
            if (sectionTitle) sectionTitle.innerHTML = '🖼️ Image Results';
            searchContext = await fetchImageResults(query);
        } else {
            if (sectionTitle) sectionTitle.innerHTML = '🌐 Web Results';
            searchContext = await fetchWebResults(query);
        }
        
        fetchAIResults(query, searchContext);
    });

    // Tavily API for Web Search
    async function fetchWebResults(query) {
        try {
            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query: query,
                    search_depth: "basic",
                    max_results: 20
                })
            });
            
            const data = await response.json();

            let html = '';
            let contextStr = '';
            
            if (data.results && data.results.length > 0) {
                data.results.forEach(item => {
                    html += `
                        <div class="web-result">
                            <a href="${item.url}" target="_blank" class="web-result-title">${item.title}</a>
                            <div class="web-result-snippet">${item.content}</div>
                        </div>
                    `;
                    contextStr += `Başlık: ${item.title}\nİçerik: ${item.content}\n\n`;
                });
            } else {
                html = '<div class="placeholder-text">No web results found.</div>';
            }
            
            webContent.innerHTML = html;
            return contextStr;
        } catch (error) {
            console.error('Web Search Error:', error);
            webContent.innerHTML = '<div class="placeholder-text" style="color:#ff6b6b;">Error fetching web results.</div>';
            return '';
        }
    }

    // Image Search using Tavily
    async function fetchImageResults(query) {
        try {
            const response = await fetch('https://api.tavily.com/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: tavilyApiKey,
                    query: query,
                    search_depth: "basic",
                    include_images: true,
                    max_results: 10
                })
            });
            const data = await response.json();
            
            let html = '<div class="image-grid">';
            let contextStr = '';
            
            if (data.images && data.images.length > 0) {
                const uniqueImages = [...new Set(data.images)];
                uniqueImages.forEach((imgUrl, index) => {
                    html += `
                        <div class="image-result">
                            <a href="${imgUrl}" target="_blank">
                                <img src="${imgUrl}" alt="Image result ${index + 1}" onerror="this.parentElement.parentElement.style.display='none'">
                            </a>
                        </div>
                    `;
                });
                if (data.results && data.results.length > 0) {
                    data.results.forEach(item => {
                        contextStr += `Başlık: ${item.title}\nİçerik: ${item.content}\n\n`;
                    });
                } else {
                    contextStr = `Kullanıcı "${query}" için görsel araması yaptı. Bu konu hakkında genel bir özet bilgi ver.`;
                }
            } else {
                html = '<div class="placeholder-text">No images found. Please try another query.</div>';
            }
            html += '</div>';
            
            webContent.innerHTML = html;
            return contextStr;
        } catch (error) {
            console.error('Image Search Error:', error);
            webContent.innerHTML = '<div class="placeholder-text" style="color:#ff6b6b;">Error fetching images.</div>';
            return '';
        }
    }

    // Wikipedia API for Web Search
    async function fetchWikipediaResults(query) {
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
            const data = await response.json();
            
            let html = '';
            let contextStr = '';
            
            if (data.query && data.query.search && data.query.search.length > 0) {
                data.query.search.forEach(item => {
                    const url = `https://en.wikipedia.org/?curid=${item.pageid}`;
                    html += `
                        <div class="web-result">
                            <a href="${url}" target="_blank" class="web-result-title">${item.title}</a>
                            <div class="web-result-snippet">${item.snippet}</div>
                        </div>
                    `;
                    // Strip HTML tags from snippet for AI context
                    const cleanSnippet = item.snippet.replace(/<[^>]*>?/gm, "");
                    contextStr += `Başlık: ${item.title}\nİçerik: ${cleanSnippet}\n\n`;
                });
            } else {
                html = '<div class="placeholder-text">No Wikipedia results found.</div>';
            }
            
            webContent.innerHTML = html;
            return contextStr;
        } catch (error) {
            console.error('Wikipedia Search Error:', error);
            webContent.innerHTML = '<div class="placeholder-text" style="color:#ff6b6b;">Error fetching Wikipedia results.</div>';
            return '';
        }
    }

    // Groq API (AI Search)
    async function fetchAIResults(query, contextStr) {
        if (!currentApiKey || currentApiKey.startsWith("ENTER_")) {
            aiContent.innerHTML = `
                <div class="placeholder-text" style="color:#ffcc00;">
                    No valid Groq API key found. Please encode your key in base64 and add it to script.js.
                </div>`;
            return;
        }

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-20b', 
                    messages: [
                        { 
                            role: 'system', 
                            content: 'Sen "GHSearch" adlı gelişmiş ve akıllı bir arama motoru asistanısın. Görevin, kullanıcıların aradığı terimler hakkında sana sunulan WEB ARAMA SONUÇLARINI temel alarak doğrudan, net, kapsamlı ve Markdown formatında yapılandırılmış (tablolar, listeler vs. kullanarak) bilgiler sunmaktır. Gereksiz giriş cümlelerinden kaçın ve odak noktasına hızlıca gir.' 
                        },
                        { 
                            role: 'user', 
                            content: `Arama Sorgusu: "${query}"\n\nİşte Tavily tarafından bulunan güncel web arama sonuçları:\n${contextStr}\n\nLütfen bu arama sonuçlarını kullanarak sorguyla ilgili en önemli bilgileri, detayları ve güncel verileri profesyonel bir dille sun.` 
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'API request failed');
            }

            const data = await response.json();
            const rawText = data.choices[0].message.content;
            
            // Parse Markdown to HTML using marked.js
            const formattedHTML = marked.parse(rawText);

            aiContent.innerHTML = `<div class="ai-text">${formattedHTML}</div>`;

        } catch (error) {
            console.error('AI Search Error:', error);
            let errMsg = 'Error fetching AI results.';
            if (error.message.includes('API request failed')) {
                 errMsg += ' Check if your API key is valid.';
            } else {
                 errMsg += ' ' + error.message;
            }
            aiContent.innerHTML = `<div class="placeholder-text" style="color:#ff6b6b;">${errMsg}</div>`;
        }
    }
});
