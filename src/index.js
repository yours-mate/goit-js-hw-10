import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import CountryCardTemplate from './templates/country-card.hbs';
import CountryListTemplate from './templates/country-list.hbs';

const DEBOUNCE_DELAY = 300;
let searchInput = '';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchBoxInputHandle, DEBOUNCE_DELAY)
);
function onSearchBoxInputHandle() {
  refs.countryList.innerHTML = '';
  refs.countryCard.innerHTML = '';
  if (refs.searchBox.value.trim() !== '') {
    searchInput = refs.searchBox.value.trim();
    fetchCountries(searchInput)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        } else if (countries.length >= 2) {
          const listMarkup = CountryListTemplate(countries);
          refs.countryList.insertAdjacentHTML('beforeend', listMarkup);
        } else {
          const languagesList = Object.values(countries[0].languages);
          countries[0].languages = languagesList.join(', ');
          const cardMarkup = CountryCardTemplate(countries[0]);
          refs.countryCard.insertAdjacentHTML('beforeend', cardMarkup);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
