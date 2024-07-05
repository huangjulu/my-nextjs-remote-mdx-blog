/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://your-domain.com',
    //'http://localhost:3000'
    generateRobotsTxt: true,
    generateIndexSitemap: false,
}