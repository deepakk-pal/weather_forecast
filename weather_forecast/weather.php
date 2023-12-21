<?php

$apiKey = 'fae15053f892219a026abbc3dddcf7ab';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['city'])) {
    $city = urlencode($_GET['city']);

    $apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q={$city}&appid={$apiKey}&units=metric";

    $ch = curl_init($apiUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if ($response === false) {

        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {

        curl_close($ch);
        $forecastData = json_decode($response, true);

        if ($forecastData && isset($forecastData['list'])) {
            $formattedData = [];

            foreach ($forecastData['list'] as $forecast) {
                $date = date('Y-m-d H:i:s', $forecast['dt']);
                $temperature = $forecast['main']['temp'];
                $description = $forecast['weather'][0]['description'];
                $humidity = $forecast['main']['humidity'];
                $windSpeed = $forecast['wind']['speed'];

                $formattedData[] = [
                    'date' => $date,
                    'temperature' => $temperature,
                    'description' => $description,
                    'humidity' => $humidity,
                    'windSpeed' => $windSpeed
                ];
            }
            echo json_encode($formattedData);
        } else {
            $errorData = json_decode($response, true);
            if (isset($errorData['message']) && stripos($errorData['message'], 'city not found') !== false) {
                echo json_encode(['error' => 'City not found. Please enter a valid city name.']);
            } else {
                echo json_encode(['error' => 'Error decoding or processing forecast data.']);
            }
        }
    }
} else {
    echo json_encode(['error' => 'Invalid request.']);
}
?>
