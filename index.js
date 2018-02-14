// Get search term, search limit, sort by
// Use search method of reddit api to fetch data

// Import
import reddit from './redditapi';

// Get searchForm
const searchForm = document.getElementById('search-form');

// Add event submit listener
searchForm.addEventListener('submit', e => {
   // Get search term
   const searchTerm = document.getElementById('search-input').value;
   
   // Get Sort By
   const sortBy = document.querySelector('input[name="sortby"]:checked').value;

   // Get Search limit
   const searchLimit = document.getElementById('limit').value;

   // // Search Term validation
   // if(searchTerm === '') {
   //    showMessage('Please add the search term', 'alert-danger');
   // }
   
   // In case not importing reddit
   // function search(searchTerm, searchLimit, sortBy)  {
   //    return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&limit=${searchLimit}&sort=${sortBy}`)
   //    .then(res => res.json())
   //    .then(data => data.data.children.map(data => data.data))
   //    .catch(err => console.log(err));
   // }

   //Search Reddit
   reddit.search(searchTerm, searchLimit, sortBy)
   .then(results => {
      let output = '<div class="card-columns">';
      results.forEach(result => {
         console.log(result);
         // Check image
         const image = result.preview 
         ?
         result.preview.images[0].source.url
         :
         'https://s3.amazonaws.com/media.eremedia.com/uploads/2014/10/15174120/reddit-logo2.png'

         output += `
            <div class="card">
               <img class="card-img-top" src='${image}' alt="Card image cap">
               <div class="card-body">
                  <h5 class="card-title">${result.title}</h5>
                  <p class="card-text">${truncateText(result.selftext, 100)}</p>
                  <a href=${result.url} class="btn btn-primary">Read More</a>
               </div>
            </div>
         `;
      });

      output += '</div>';
      // Display output
      document.getElementById('results').innerHTML = output;
      
   });

   e.preventDefault();
});

//Truncate text
function truncateText(text, limit) {
   const shortened = text.indexOf(' ', limit);
   if(shortened == -1) return text;
   return text.substring(0, shortened);
}
