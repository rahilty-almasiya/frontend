<?php

declare(strict_types=1);

define('SITE_URL', rtrim(getenv('SEO_SITE_URL') ?: 'https://rahilatialmasiya.com', '/'));
define('API_URL', rtrim(getenv('SEO_API_URL') ?: 'https://apiv2.rahilatialmasiya.com/public', '/'));

$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$decodedPath = rawurldecode($requestPath);
$normalisedRequestPath = $decodedPath === '/' ? '/' : '/' . trim($decodedPath, '/');
$query = $_SERVER['QUERY_STRING'] ?? '';

// Keep deprecated URLs in one audited map and redirect before the locale
// fallback. This prevents obsolete paths from ever becoming valid SPA URLs.
$legacyRedirects = require __DIR__ . '/legacy-redirects.php';
if (isset($legacyRedirects[$normalisedRequestPath])) {
    header('Location: ' . $legacyRedirects[$normalisedRequestPath] . ($query ? '?' . $query : ''), true, 301);
    exit;
}

$segments = array_values(array_filter(explode('/', trim($requestPath, '/'))));
$locale = in_array($segments[0] ?? '', ['ar', 'en'], true) ? array_shift($segments) : null;

if ($locale === null) {
    $target = '/ar' . ($normalisedRequestPath === '/' ? '' : $normalisedRequestPath);
    header('Location: ' . $target . ($query ? '?' . $query : ''), true, 301);
    exit;
}

$contentPath = '/' . implode('/', $segments);
$contentPath = $contentPath === '/' ? '/' : rtrim($contentPath, '/');

// Preserve equity from pre-slug URLs such as /ar/fleet/7.
if (preg_match('#^/(fleet|services|offers|hotels)/\\d+$#', $contentPath)) {
    $redirectJson = @file_get_contents(API_URL . '/api/seo/canonical-path?path=' . rawurlencode($contentPath));
    $redirectData = is_string($redirectJson) ? json_decode($redirectJson, true) : null;
    $canonicalPath = is_array($redirectData) ? ($redirectData['path'] ?? $contentPath) : $contentPath;
    if ($canonicalPath !== $contentPath) {
        $query = $_SERVER['QUERY_STRING'] ?? '';
        header('Location: /' . $locale . $canonicalPath . ($query ? '?' . $query : ''), true, 301);
        exit;
    }
}
$defaultCanonical = SITE_URL . '/' . $locale . ($contentPath === '/' ? '' : $contentPath);
$alternateAr = SITE_URL . '/ar' . ($contentPath === '/' ? '' : $contentPath);
$alternateEn = SITE_URL . '/en' . ($contentPath === '/' ? '' : $contentPath);

$context = stream_context_create(['http' => ['timeout' => 3, 'ignore_errors' => true, 'header' => "Accept: application/json\r\n"]]);
$json = @file_get_contents(API_URL . '/api/seo/resolve?path=' . rawurlencode($contentPath), false, $context);
$apiStatus = 0;
foreach ($http_response_header ?? [] as $headerLine) {
    if (preg_match('#^HTTP/\\S+\\s+(\\d{3})#i', $headerLine, $matches)) $apiStatus = (int) $matches[1];
}

// A route unknown to the SEO catalog is unknown to the website. Returning a
// successful SPA shell here creates soft-404s that search engines index.
if ($apiStatus === 404) {
    http_response_code(404);
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Robots-Tag: noindex, nofollow');
    echo '<!doctype html><html lang="' . $locale . '" dir="' . ($locale === 'ar' ? 'rtl' : 'ltr') . '"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><title>404 - Not Found</title></head><body><h1>404 - Not Found</h1><p>The requested page does not exist.</p></body></html>';
    exit;
}
$seo = is_string($json) ? json_decode($json, true) : null;
$seo = is_array($seo) ? $seo : [];

/**
 * Search-engine and social-preview crawlers only; this must never match ordinary
 * browsers, so real users keep getting the exact same client-rendered SPA shell.
 */
$isKnownBot = static function (): bool {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if ($ua === '') return false;
    return (bool) preg_match(
        '/Googlebot|Google-InspectionTool|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Applebot|Discordbot|TelegramBot|SkypeUriPreview|redditbot|Pinterestbot/i',
        $ua
    );
};
$canonical = $defaultCanonical;
if (!empty($seo['canonical_url'])) {
    $configuredCanonical = (string) $seo['canonical_url'];
    $configuredPath = parse_url($configuredCanonical, PHP_URL_PATH) ?: '/';
    $configuredPath = preg_replace('#^/(?:ar|en)(?=/|$)#', '', $configuredPath) ?: '/';
    $configuredOrigin = rtrim((parse_url($configuredCanonical, PHP_URL_SCHEME) ?: 'https') . '://' . (parse_url($configuredCanonical, PHP_URL_HOST) ?: parse_url(SITE_URL, PHP_URL_HOST)), '/');
    $canonical = $configuredOrigin . '/' . $locale . ($configuredPath === '/' ? '' : $configuredPath);
}

$suffix = $locale === 'ar' ? 'ar' : 'en';
$siteName = $locale === 'ar' ? 'رحلتي الماسية' : 'Rahilty Almasiya';
$title = $seo['meta_title_' . $suffix] ?? ($locale === 'ar' ? 'رحلتي الماسية | سياحة ونقل فاخر' : 'Rahilty Almasiya | Luxury Travel & Transportation');
$description = $seo['meta_description_' . $suffix] ?? ($locale === 'ar'
    ? 'رحلتي الماسية تقدم رحلات سياحية ونقلاً خاصاً فاخراً في المملكة العربية السعودية.'
    : 'Rahilty Almasiya offers curated tours, private transport, and premium hospitality across Saudi Arabia.');
$keywords = $seo['meta_keywords_' . $suffix] ?? '';
$ogTitle = $seo['og_title_' . $suffix] ?? $title;
$ogDescription = $seo['og_description_' . $suffix] ?? $description;
$image = $seo['og_image'] ?? SITE_URL . '/assets/logo.png';
$privatePaths = ['/login', '/forgot-password', '/reset-password', '/profile', '/checkout', '/booking', '/payment-success', '/payment-error'];
$isPrivate = in_array($contentPath, $privatePaths, true);
$robots = ((!$isPrivate && ($seo['indexable'] ?? true)) ? 'index' : 'noindex') . ',' . (($seo['follow_links'] ?? true) ? 'follow' : 'nofollow');
$twitterCard = $seo['twitter_card'] ?? 'summary_large_image';

$escape = static fn (?string $value): string => htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$schema = $seo['schema_json'] ?? [
    '@type' => 'WebPage',
    'name' => $title,
    'description' => $description,
    'url' => $canonical,
    'inLanguage' => $locale,
];
$schema['name'] = $title;
$schema['description'] = $description;
$schema['url'] = $canonical;
$schema['inLanguage'] = $locale === 'ar' ? 'ar-SA' : 'en-US';
if (($schema['@type'] ?? null) === 'Article') $schema['headline'] = $title;
$ogType = ($schema['@type'] ?? null) === 'Article' ? 'article' : 'website';
$graph = [
    '@context' => 'https://schema.org',
    '@graph' => [[
        '@type' => 'Organization',
        '@id' => SITE_URL . '/#organization',
        'name' => 'Rahilty Almasiya',
        'url' => SITE_URL,
        'logo' => SITE_URL . '/assets/logo.png',
    ], $schema],
];

$html = file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
    http_response_code(500);
    exit('Application shell is unavailable.');
}

$html = preg_replace('/<html[^>]*>/i', '<html lang="' . $locale . '" dir="' . ($locale === 'ar' ? 'rtl' : 'ltr') . '">', $html, 1);
$html = preg_replace('/<title>.*?<\/title>/is', '<title>' . $escape($title) . '</title>', $html, 1);
$html = preg_replace('/<meta\s+name="description"[^>]*>/i', '<meta name="description" content="' . $escape($description) . '">', $html, 1);

// Only load the two font families actually rendered for this locale (body + heading font),
// instead of all four - same weights as before per family, just fewer families per request.
$fontFamilies = $locale === 'ar'
    ? 'family=Tajawal:wght@300;400;500;700;800&family=Amiri:wght@400;700'
    : 'family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800';
$fontsUrl = 'https://fonts.googleapis.com/css2?' . $fontFamilies . '&display=swap';
$html = preg_replace(
    '/https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^"]*/',
    $fontsUrl,
    $html
);

$head = '<meta name="robots" content="' . $escape($robots) . '">' . "\n";
if ($keywords !== '') $head .= '<meta name="keywords" content="' . $escape($keywords) . '">' . "\n";
$head .= '<link rel="canonical" href="' . $escape($canonical) . '">' . "\n";
$head .= '<link rel="alternate" hreflang="ar" href="' . $escape($alternateAr) . '">' . "\n";
$head .= '<link rel="alternate" hreflang="en" href="' . $escape($alternateEn) . '">' . "\n";
$head .= '<link rel="alternate" hreflang="x-default" href="' . $escape($alternateAr) . '">' . "\n";
$head .= '<meta property="og:site_name" content="' . $escape($siteName) . '">' . "\n";
$head .= '<meta property="og:title" content="' . $escape($ogTitle) . '">' . "\n";
$head .= '<meta property="og:description" content="' . $escape($ogDescription) . '">' . "\n";
$head .= '<meta property="og:url" content="' . $escape($canonical) . '">' . "\n";
$head .= '<meta property="og:type" content="' . $ogType . '">' . "\n";
$head .= '<meta property="og:image" content="' . $escape($image) . '">' . "\n";
$head .= '<meta property="og:locale" content="' . ($locale === 'ar' ? 'ar_SA' : 'en_US') . '">' . "\n";
$head .= '<meta name="twitter:card" content="' . $escape($twitterCard) . '">' . "\n";
$head .= '<meta name="twitter:title" content="' . $escape($ogTitle) . '">' . "\n";
$head .= '<meta name="twitter:description" content="' . $escape($ogDescription) . '">' . "\n";
$head .= '<meta name="twitter:image" content="' . $escape($image) . '">' . "\n";
$head .= '<script type="application/ld+json" id="seo-schema">' . json_encode($graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) . '</script>' . "\n";
$head .= '<script>window.__SEO_DATA__=' . json_encode($seo, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) . ';</script>' . "\n";
$html = str_replace('</head>', $head . '</head>', $html);

// Bots get the rendered content inlined into the SPA's mount point so the very first
// response already contains the page's text instead of an empty shell awaiting JS.
// Regular visitors are untouched: div#root stays empty and React mounts as before.
if ($isKnownBot()) {
    $contentField = 'content_html_' . $suffix;
    $contentHtml = $seo[$contentField] ?? '';
    if (is_string($contentHtml) && $contentHtml !== '') {
        $html = str_replace('<div id="root"></div>', '<div id="root">' . $contentHtml . '</div>', $html);
    }
}

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=3600');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
echo $html;
