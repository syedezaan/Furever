
document.addEventListener('DOMContentLoaded', () => {
  
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('starRatingValue');

  starBtns.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val, 10);
      if (ratingInput) ratingInput.value = val;

      starBtns.forEach((s, idx) => {
        if (idx < val) {
          s.className = 'bi bi-star-fill star-btn cursor-pointer';
        } else {
          s.className = 'bi bi-star star-btn cursor-pointer';
        }
      });
    });
  });

  
  const form = document.getElementById('feedbackForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!App.validateForm(form)) {
        App.toast('Please fill out all required fields properly.', 'Validation Error', 'warning');
        return;
      }

      const name = document.getElementById('feedbackName')?.value.trim() || 'Reviewer';
      const rating = ratingInput?.value || '5';
      const category = document.getElementById('feedbackCategory')?.value || 'General';

      App.toast(`Thank you, ${name}! Your ${rating}-star review for "${category}" has been recorded.`, 'Review Submitted', 'success', 'bi-heart-fill');
      App.confetti();
      form.reset();

      
      starBtns.forEach(s => s.className = 'bi bi-star-fill star-btn cursor-pointer');
      if (ratingInput) ratingInput.value = '5';
    });
  }
});
