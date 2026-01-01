from django.http import JsonResponse
from django.core.mail import send_mail
import json, random, threading
from .models import WifiAccess
from django.views.decorators.csrf import csrf_exempt

def send_email_async(subject, message, from_email, recipient_list):
    """Send email in background thread"""
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        print(f"✅ Email sent to {recipient_list}")
    except Exception as e:
        print(f"❌ Email failed: {str(e)}")

@csrf_exempt
def send_otp(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")

            if not name or not email:
                return JsonResponse({"error": "Name and email are required"}, status=400)

            otp = random.randint(100000, 999999)

            WifiAccess.objects.create(
                name=name,
                email=email,
                otp=otp,
                is_verified=False
            )

            # Send email asynchronously
            thread = threading.Thread(
                target=send_email_async,
                args=(
                    "Your Wi-Fi OTP",
                    f"Hello {name},\n\nYour OTP is: {otp}\n\nValid for 5 minutes.",
                    'harishsri192@gmail.com',
                    [email]
                ),
                daemon=True
            )
            thread.start()
            
            print(f"🔄 OTP request queued for {email}: {otp}")
            return JsonResponse({"message": "OTP sent successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            print(f"Error in send_otp: {str(e)}")
            return JsonResponse({"error": "An error occurred"}, status=500)

    return JsonResponse({"error": "POST method required"}, status=405)


@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        otp = data.get("otp")

        try:
            record = WifiAccess.objects.get(email=email, otp=otp)
            record.is_verified = True
            record.save()

            return JsonResponse({
                "verified": True,
                "wifi_password": "admin@123"
            })

        except WifiAccess.DoesNotExist:
            return JsonResponse({"verified": False}, status=400)

    return JsonResponse({"error": "POST method required"}, status=405)
