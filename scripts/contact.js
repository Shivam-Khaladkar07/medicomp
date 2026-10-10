export function initContact() {
  const contactForm = document.getElementById('contact-form');
  const faqQuestions = document.querySelectorAll('.faq-question');

  // Handle contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      // Simulate form submission
      const submitButton = contactForm.querySelector('[data-id="form-submit"]');
      const originalText = submitButton.innerHTML;
      
      submitButton.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Sending...';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        submitButton.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Message Sent!';
        submitButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        submitButton.classList.add('bg-green-600');
        
        // Reset form
        contactForm.reset();
        
        // Show success message
        alert('Thank you for your message! We\'ll get back to you within 24 hours.');
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
          submitButton.classList.remove('bg-green-600');
          submitButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }, 3000);
      }, 2000);
    });
  }

  // Handle FAQ toggles
  faqQuestions.forEach(button => {
    button.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('i[data-lucide="chevron-down"]');
      
      // Close other open FAQs
      faqQuestions.forEach(otherButton => {
        if (otherButton !== button) {
          const otherAnswer = otherButton.nextElementSibling;
          const otherIcon = otherButton.querySelector('i[data-lucide="chevron-down"]');
          otherAnswer.classList.add('hidden');
          otherIcon.style.transform = 'rotate(0deg)';
        }
      });
      
      // Toggle current FAQ
      answer.classList.toggle('hidden');
      const isOpen = !answer.classList.contains('hidden');
      icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  });
}