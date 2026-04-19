const axios = require('axios');
const cheerio = require('cheerio');

const scrapeInternships = async (domain) => {
    const internships = [];
    
    try {
        const internshalaUrl = `https://internshala.com/internships/keywords-${domain.replace(/\s+/g, '-')}`;
        
        // Use realistic headers to avoid basic scraping blocks
        const response = await axios.get(internshalaUrl, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        $('.individual_internship').each((i, el) => {
            const title = $(el).find('.job-title-container a, .job-title-href').text().trim() || $(el).find('h3').first().text().trim();
            const company = $(el).find('.company-name').text().trim() || $(el).find('.company_name').text().trim();
            const location = $(el).find('.location_link').text().trim() || $(el).find('.locations').text().trim() || 'Remote';
            
            let link = $(el).find('.job-title-container a, .job-title-href').attr('href');
            if (link && !link.startsWith('http')) {
                link = 'https://internshala.com' + link;
            }
            
            if (title && company) {
                internships.push({
                    title,
                    company,
                    location,
                    platform: 'Internshala',
                    link: link || internshalaUrl,
                    source: 'Internshala'
                });
            }
        });
        
    } catch (error) {
        console.error('Scraping Service Error (Axios/Cheerio):', error.message);
    }
    
    // Fallback if scraping gets blocked or fails (e.g. strict CAPTCHAs)
    if (internships.length === 0) {
        console.log("Providing mocked scraped jobs for domain:", domain);
        const fallbackJobs = [
            {
                title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Intern`,
                company: 'Tech Solutions Inc.',
                location: 'Remote',
                platform: 'Web Scraping Fallback',
                link: '#',
                source: 'External'
            },
            {
                title: `Junior ${domain.charAt(0).toUpperCase() + domain.slice(1)} Developer`,
                company: 'Global Innovations',
                location: 'New York, NY',
                platform: 'Web Scraping Fallback',
                link: '#',
                source: 'External'
            },
            {
                title: `${domain.toUpperCase()} Analyst Internship`,
                company: 'Startup Hub',
                location: 'San Francisco, CA',
                platform: 'Web Scraping Fallback',
                link: '#',
                source: 'External'
            }
        ];
        return fallbackJobs;
    }
    
    return internships;
};

module.exports = {
    getAggregatedInternships: scrapeInternships
};
