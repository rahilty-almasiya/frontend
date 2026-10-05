<?php
declare(strict_types=1);
$apiBase = rtrim(getenv('SEO_API_URL') ?: 'https://apiv2.rahilatialmasiya.com/public', '/');
$source = $apiBase . '/sitemap.xml';
$context = stream_context_create(['http' => ['timeout' => 5, 'ignore_errors' => true]]);
$content = @file_get_contents($source, false, $context);
if ($content === false || !str_contains($content, '<urlset')) {
    http_response_code(503);
    header('Retry-After: 300');
    exit('Sitemap temporarily unavailable.');
}
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=900');
echo $content;
