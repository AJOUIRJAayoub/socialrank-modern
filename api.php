<?php
// api.php - API pour RankI5
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Inclure la configuration
require_once 'config.php';

try {
    // Paramètres
    $action = $_GET['action'] ?? 'list';
    $search = $_GET['search'] ?? '';
    
    if ($action === 'list') {
        // Préparer la requête
        if ($search) {
            $stmt = $pdo->prepare("SELECT * FROM chaines WHERE nom LIKE ? ORDER BY abonnes DESC");
            $stmt->execute(['%' . $search . '%']);
        } else {
            $stmt = $pdo->query("SELECT * FROM chaines ORDER BY abonnes DESC");
        }
        
        $channels = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $channels
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur'
    ]);
}