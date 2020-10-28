<?php
require './config.php';
require './func.php';

$data = file_get_contents('php://input');
//file_put_contents('1.json', $data);

if (!isset($data) || empty($data)) die("Ничего не найдено");

$json = json_decode($data, true);

$message = "Новая заявка с сайта \n\n";

if ($json['step0']['question'] && $json['step0']['answers']) {
    $message .= "Квартира после ремонта? - " . implode(", ", $json['step0']['answers']) . "\n";
} else {
    $response = [
        "status" => "error",
        "message" => "Произошла ошибка"
    ];
}

if ($json['step1']['question'] && $json['step1']['answers']) {
    $message .= "Площадь квартиры - " . implode(", ", $json['step1']['answers']) . "\n";
} else {
    $response = [
        "status" => "error",
        "message" => "Произошла ошибка"
    ];
}

if ($json['step2']['question'] && $json['step2']['answers']) {
    $message .= "Как давно проводилась генеральная уборка - " . implode(", ", $json['step2']['answers']) . "\n";
} else {
    $response = [
        "status" => "error",
        "message" => "Произошла ошибка"
    ];
}

if ($json['step3']['question'] && $json['step2']['answers']) {
    $message .= "Помыть окна? - " . implode(", ", $json['step3']['answers']) . "\n\n";
} else {
    $response = [
        "status" => "error",
        "message" => "Произошла ошибка"
    ];
}

$date_empty = false;

foreach ($json['step4'] as $item) {
    if (! $item) $date_empty = true;
}

if (! $date_empty) {

    $message .= "Имя: " . $json['step4']['name'] . "\n";
    $message .= "Номер телефона: " . $json['step4']['phone'] . "\n";
    $message .= "Адрес электронной почты: " . $json['step4']['email'] . "\n";
    $message .= "Способ связи: " . $json['step4']['call'] . "\n";

    $my_data = [
        "message" => $message
    ];

    get_data(BASE_URL . TOKEN . "/send?" . http_build_query($my_data));

    $response = [
        "status" => "ok",
        "message" => "Спасибо, скоро мы с вами свяжемся"
    ];
} else {
    if (! $json['step4']['phone']) {
        $error_message = 'Заполните номер телефона';
    } else if (! $json['step4']['name']) {
        $error_message = 'Заполните имя';
    } else if (! $json['step4']['email']) {
        $error_message = 'Заполните адрес электронной почты';
    } else if (! $json['step4']['call']) {
        $error_message = 'Заполните способ связи';
    } else {
        $error_message = 'Что-то пошло не так';
    }

    $response = [
        "status" => "error",
        "message" => $error_message
    ];
}

header("Content-Type: application/json");
echo json_encode($response);