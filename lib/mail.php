<?php
namespace lib;

//封装邮件

class Mail
{
    public function send()
    {
        require app_path . 'lib/phpmailer/class.phpmailer.php';
        $formEmail = "sales@jtoyp.com";
        $fromName = "STOSZ";
        $host = "iyfyw.com";
        $password = "Bslf007";
        $email = 'liujun@stosz.com';
        $address = $_POST['city'] . ' ' . $_POST['province'] . ' ' . $_POST['address'];
        if ($payment_method == 'yjf') {
            $payment_type = 'クレジットカード';
        } else {
            $payment_type = '振替';
        }
        try {
            $mail = new PHPMailer(true);
            $mail->IsSMTP();
            $mail->SMTPAuth = true;     // turn on SMTP authentication
            $mail->CharSet = 'UTF-8'; //设置邮件的字符编码，这很重要，不然中文乱码
            $mail->SetLanguage('ja');
            $mail->SMTPAuth = true;                  //开启认证
            $mail->Port = 25;
            $mail->Host = $host;
            $mail->Username = $formEmail;
            $mail->Password = $password;
            $mail->From = $formEmail;
            $mail->FromName = $fromName;
            $mail->AddAddress($email);
            $mail->Subject = "注文の確認";
            $mail->Body = "<p>ご注文いただきありがとうございます。</p><p>ご注文の確認が完了しました</p><br/><p>ご注文の詳細</p><p>------------------</p><p>ご注文番号: " . $order_id . "</p><p>注文日:" . date('Y-m-d H:i:s', $time) . "</p><p>氏名:" . $first_name . " " . $last_name . "</p><p>フリガナ:" . $sub_first_name . " " . $sub_last_name . "</p><p>届け先:" . $address . "</p><p>電話番号:" . $_POST['mob'] . "</p><p>注文商品:" . $str . "</p><p>付款方式:" . $payment_type . "</p><p>合計:" . $price . "円 </p><br/><br/><br/><p>その他の情報またはヘルプが必要な場合は、" . $email . " にメールを送ってください。</p><br/><p>ご注文ありがとうございました。</p>";
            $mail->WordWrap = 80; // 设置每行字符串的长度
            $mail->IsHTML(true);
            $mail->Send();
            echo '邮件已发送';
        } catch (phpmailerException $e) {
            echo "邮件发送失败：" . $e->errorMessage();
        }
    }
}
