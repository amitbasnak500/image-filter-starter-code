import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/filteredimage", async(req, res) => {
    /*
       Task 1: Here we need to validate query
     */
    let img_url: string = req.query.imageURL;
    if(!isUrlValid(img_url)) {
      res.status(404).send('Missing or Invalid url: ' + img_url);
    }
    /*
       Task 2: call filterImageFromURL(image_url) to filter the image
    */
    let filteredImage: string = await filterImageFromURL(img_url);
    if(null === filteredImage || undefined === filteredImage ) {
      return res.status(404).send('filtered image not found');
    }

    /*
       Task 3: send the resulting file in the response
       Task 4: deletes any files on the server on finish of the response
    */
    return res.status(200).sendFile('Filtered Image is' + filteredImage, () => {
      deleteLocalFiles([filteredImage]);
    });
  })

  function isUrlValid(image_url: string) {
    const pattern = new RegExp('/(http(s)?:\\/\\/.)?(www\\.)' +
        '?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\' +
        '.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g)');
    return !!pattern.test(image_url);
  }

  // Start the Server
  app.listen( port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
  } );
})();