var searchInput = document.getElementById('coffeeSearch');
var grid = document.getElementById('coffeeGrid');
var cards = grid ? grid.querySelectorAll('.card') : [];
var noResults = document.getElementById('noResults');
var pills = document.querySelectorAll('.pill');

var activeFilter = 'all';

function filterCards() {
  if (!searchInput || !noResults) return;

  var query = searchInput.value.trim().toLowerCase();
  var visibleCount = 0;

  cards.forEach(function(card) {
    var roast = card.dataset.roast;
    var searchText = card.dataset.name.toLowerCase();

    var matchesFilter = activeFilter === 'all' || roast === activeFilter;
    var matchesSearch = query === '' || searchText.includes(query);

    if (matchesFilter && matchesSearch) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

if (searchInput && grid && noResults) {
  searchInput.addEventListener('input', filterCards);
}

pills.forEach(function(pill) {
  pill.addEventListener('click', function() {
    pills.forEach(function(button) {
      button.classList.remove('active');
    });
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    filterCards();
  });
});
