<?php
declare(strict_types=1);
header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: public, max-age=3600');
echo "User-agent: *\n";
echo "Allow: /\n";
echo "Disallow: /checkout\n";
echo "Disallow: /profile\n";
echo "Disallow: /login\n";
echo "Disallow: /forgot-password\n";
echo "Disallow: /reset-password\n";
echo "Disallow: /booking\n";
echo "Disallow: /payment-success\n";
echo "Disallow: /payment-error\n";
foreach (['ar', 'en'] as $locale) {
    foreach (['checkout', 'profile', 'booking', 'login', 'forgot-password', 'reset-password', 'payment-success', 'payment-error'] as $path) {
        echo "Disallow: /{$locale}/{$path}\n";
    }
}
echo "\n";
echo "Sitemap: https://rahilatialmasiya.com/sitemap.xml\n";
