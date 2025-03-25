import io
from django.core.mail import EmailMessage
from django_rq import job
from django.template.loader import render_to_string
from xhtml2pdf import pisa 


@job
def send_gmail(subject, recipient, template_name, context, pdf_filename="document.pdf"):
    html_content = render_to_string(template_name, context)

    pdf_file = io.BytesIO()
    pisa_status = pisa.CreatePDF(io.BytesIO(html_content.encode("utf-8")), dest=pdf_file)
    if pisa_status.err:
        print("Error al generar el PDF") 
        return

    pdf_file.seek(0) 

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email="tienda@gmail.com",
        to=[recipient],
    )
    email.content_subtype = "html" 

    email.attach(pdf_filename, pdf_file.read(), "application/pdf")

    email.send()

@job
def send_reset_gmail(recipient,reset_link):
    subject = "Restablecimiento de contraseña"
    message = f"Haz clic en el siguiente enlace para restablecer tu contraseña: {reset_link}"
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email="tienda@gmail.com",
        to=[recipient],
    )
    email.send()