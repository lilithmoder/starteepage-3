// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    // Add the URLs of the RSS feeds you want to display here
    const rssFeedUrls = [
        'https://feeds.bbci.co.uk/news/world/rss.xml', // Example: NYT World News
        'https://www.theverge.com/rss/index.xml', // Example: BBC World News
        'https://lightroomkillertips.com/feed/' // Example: The Verge
        // Add more feed URLs here as strings, separated by commas
    ];

    // Number of items to display per feed
    const maxItemsPerFeed = 5;

    // Target element where feeds will be displayed
    const rssContainer = document.getElementById('rss-feeds');

    // Check if the container element exists
    if (!rssContainer) {
        console.error('RSS container element (#rss-feeds) not found.');
        return; // Stop execution if the container isn't found
    }

    // Clear the "Loading..." message
    const loadingMessage = rssContainer.querySelector('.rss-loading');
    if (loadingMessage) {
        loadingMessage.remove();
    } else {
        // If loading message wasn't there, clear any existing content just in case
        rssContainer.innerHTML = '';
    }


    // --- Helper Function to Fetch and Parse Feed ---
    // Uses rss2json API to convert RSS to JSON (handles CORS)
    async function fetchAndDisplayFeed(feedUrl) {
        // The rss2json API endpoint
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
        const feedElement = document.createElement('div'); // Create a container for this specific feed
        feedElement.className = 'rss-feed-container links'; // Use 'links' class for structure

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Check if the API call was successful and returned items
            if (data.status === 'ok' && data.items) {
                // Create the structure matching your bookmarks (ul > li)
                const list = document.createElement('ul');

                // Add Feed Title
                const feedTitle = document.createElement('li');
                feedTitle.className = 'title rss-feed-title'; // Style as a title
                feedTitle.textContent = data.feed.title || 'Untitled Feed'; // Use feed title from data
                list.appendChild(feedTitle);


                // Add Feed Items
                const itemsToShow = data.items.slice(0, maxItemsPerFeed); // Limit number of items
                itemsToShow.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.className = 'rss-item'; // Class for styling individual items

                    const link = document.createElement('a');
                    link.href = item.link || '#'; // Link to the article
                    link.textContent = item.title || 'No title'; // Display article title
                    link.target = '_blank'; // Open links in a new tab
                    link.rel = 'noopener noreferrer'; // Security measure for target="_blank"

                    listItem.appendChild(link);
                    list.appendChild(listItem);
                });
                feedElement.appendChild(list); // Add the list to this feed's container

            } else {
                // Handle cases where the API call was okay but returned no items or an error status
                console.error(`Error fetching feed ${feedUrl}: ${data.message || 'No items found'}`);
                displayError(feedElement, `Could not load feed: ${feedUrl.split('/')[2] || feedUrl}`); // Show simplified error
            }

        } catch (error) {
            // Handle network errors or issues parsing the response
            console.error(`Failed to fetch or parse feed ${feedUrl}:`, error);
            displayError(feedElement, `Error loading: ${feedUrl.split('/')[2] || feedUrl}`); // Show simplified error
        }
        // Append the container for this feed (even if it contains an error message)
        rssContainer.appendChild(feedElement);
    }

    // --- Helper Function to Display Errors ---
    function displayError(container, message) {
        const list = document.createElement('ul'); // Maintain structure
        const errorItem = document.createElement('li');
        errorItem.className = 'rss-error'; // Class for styling error messages
        errorItem.textContent = message;
        list.appendChild(errorItem);
        container.appendChild(list); // Add the list with the error to the feed's container
    }


    // --- Main Execution ---
    // Check if there are any feed URLs configured
    if (rssFeedUrls.length === 0) {
        displayError(rssContainer, 'No RSS feeds configured in rss-reader.js');
        return;
    }

    // Fetch and display each feed
    rssFeedUrls.forEach(url => {
        fetchAndDisplayFeed(url);
    });

}); // End of DOMContentLoaded listener
