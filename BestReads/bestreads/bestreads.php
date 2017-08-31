<?php 

    #This php file gives set up needed data, depends on what parameter are passed in. 
    
    # If the mode parameter equals books, gives all the available books 
    # with its title and the corrsponding folder. Return those data in JSON format. 
    if ($_GET["mode"] == "books") {
        header("Content-Type: application/json");
        $books = array();
        $allBooks = glob("./books/*"); 
        
        for ($i = 0; $i < count($allBooks); $i++) {
            $folder_path = $allBooks[$i] . "/info.txt";
            $content = file_get_contents($folder_path);
            $book = array(
                "title" =>  explode("\n", $content)[0],
                "folder" => $allBooks[$i]
            );
            array_push($books, $book);
        }
            $json_data = array(
                "books"=>$books
            );
            print(json_encode($json_data));
    } 
    
    # When the mode parameter and title parameter are both set, 
    # set the data depend on the mode parameter. 
    else if (isset($_GET["mode"]) && isset($_GET["title"])) {
        $mode = $_GET["mode"];
        $given_title = $_GET["title"];
        if ($mode != "reviews") {
            $content = file_get_contents("./books/". $given_title ."/" . $mode .".txt");
        }
        
        # When the mode parameter equals description, set the data.
        # Give the data back in plain text. 
        if ($mode == "description") {
            header("Content-Type: text/plain");
            print($content);
        }
        
        # When the mode parameter equals info, set the corresponding data.
        # Give the data back in JSON format. 
        else if ($mode == "info") {
            header("Content-Type: application/json");
            $info = explode("\n", $content);
            list($book_title, $author, $stars) = $info;
            $json_data = array(
                "title" => $book_title,
                "author" => $author,
                "stars" => $stars
            );
            print(json_encode($json_data));
        }
        
        # When the mode parameter equals reviews, set the corresponding data.
        # Give the data back in JSON format. 
        else if ($mode == "reviews") {
            header("Content-Type: application/json");
            $totalReview = glob("./books/".  $given_title . "/review*.txt");
            $allReviews = array();
            
            for ($i = 0; $i < count($totalReview); $i++) {
                $reviewInfo = file_get_contents("./books/".  $given_title . "/review". ($i+1) .".txt");
                $reviewPiece = explode("\n", $reviewInfo);
                list($name, $points, $feeling) = $reviewPiece;
                
                $review = array(
                    "name" => $name,
                    "score" => $points,
                    "text" => $feeling
                );
                
                array_push($allReviews, $review);
            }
             $json_data = array(
                 $allReviews
             );
             print(json_encode($json_data));
        }
    }
    
?>