<?php

return [
	'paths' => ['api/*', 'sanctum/csrf-cookie'],
	'allowed_methods' => ['*'],
	'allowed_origins' => [
		'http://localhost:5173',
		'http://localhost:3000',
		'https://application-dev-1-oat5.onrender.com',
		'https://application-dev-1.onrender.com',
	],
	'allowed_origins_patterns' => [],
	'allowed_headers' => ['*'],
	'exposed_headers' => [],
	'max_age' => 86400,
	'supports_credentials' => true,
];
