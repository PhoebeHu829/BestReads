// Xiaodan Hu
// Section AF
// TA: Chris

// This file gives the bestreads.html page some functions.
// When the user orginally load that page, there will display all the books.
// When the user click on one of the books, it will go to the page to have specific
// information about the book. The user can go bakc to the original page by 
// click "home" on the page. 

(function() {
    "use strict";
    
    // This function set up the orginal page,
    // and gives the "home" buttom function that can let the 
    // user back to the orginal page. 
    window.onload = function() {
        getData("bestreads.php?mode=books", setPage);
        document.getElementById("back").onclick = home;
    };
   
    // Ths function using the passed url and function to fetch needed data,
    // given the data back in the json form. 
    function getData(url, functionToGo) {
        var prom = new AjaxGetPromise(url);
        prom
            .then(JSON.parse)
            .then(functionToGo);
    }
    
    // This function uses the given data back to set uo the orginal page.
    // Each book has its cover image and the title of the book.
    // If the user wants more specific information about the book he or she can 
    // click the book. 
    function setPage(subject) {
       document.getElementById("singlebook").classList.add("hidden");
        
       var allBooks = subject.books;
       for (var i = 0; i < allBooks.length; i ++) {
          var bookContainer = document.createElement("div");
          bookContainer.id = allBooks[i].folder.substring(8);
          
          var coverImage = document.createElement("img");
          coverImage.src = allBooks[i].folder + "/cover.jpg"; 
          bookContainer.appendChild(coverImage);
      
          var info = document.createElement("p");
          info.innerHTML = allBooks[i].title;
          bookContainer.appendChild(info);
          
          bookContainer.onclick = selectBook;
          document.getElementById("allbooks").appendChild(bookContainer);
       }
    }
   
    // The function happens once the user click the cover of the chosen page. 
    // It will caontains the title, author and starts of the book. Also, a description
    // and reader reviews about the book. 
    function selectBook() {
        document.getElementById("allbooks").classList.add("hidden");
        document.getElementById("singlebook").classList.remove("hidden");
        document.getElementById("cover").src = "./books/" + this.id + "/cover.jpg";
        
        getData("bestreads.php?mode=info&title=" + this.id, setInfo);
        appendDescription(this.id);
        getData("bestreads.php?mode=reviews&title=" + this.id, setReview );
    }
    
    // This function uses the given data to set the basic information, title, author 
    // and stars of the book. 
    function setInfo(subject) {
        document.getElementById("title").innerHTML = subject.title;
		document.getElementById("author").innerHTML = subject.author;
		document.getElementById("stars").innerHTML = subject.stars;
    }
    
    // This function uses the passed name of the book to request the data
    // needed to set up the description. 
    function appendDescription(name) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "bestreads.php?mode=description&title=" + name);
        xhr.onload = setDescription;
        xhr.send();
    }
    
    // This function uses the passed name of the book to set up the 
    // description of the book. 
    function setDescription() {
        var result = this.responseText;
        document.getElementById("description").innerHTML = result;
    }
    
    // This function uses the given data to set up the review part of the page.
    function setReview(subject) {
        debugger;
        document.getElementById("reviews").innerHTML = "";
        var review = subject[0];
        for (var i = 0; i < review.length; i++) {
            var reviewer = document.createElement("h3");
            reviewer.innerHTML = review[i].name;
            
            var score = document.createElement("span");
            score.innerHTML = review[i].score;
            reviewer.appendChild(score);
            document.getElementById("reviews").appendChild(reviewer);
            
            var text = document.createElement("p");
            text.innerHTML =  review[i].text;
            document.getElementById("reviews").appendChild(text);
        }
    }
    
    // This function happens when the user click the home botton,
    // and lead the user back to the orginal page. 
    function home() {
        document.getElementById("allbooks").classList.remove("hidden");
        document.getElementById("singlebook").classList.add("hidden");
    }
    
}) ();