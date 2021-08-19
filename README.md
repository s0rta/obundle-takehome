# Obundle Takehome Assignment

## Tasks

### Special item
My special item, the moon, was added to the category Special Item, and priced accordingly. BigCommerce does not allow for the entire weight of the moon in oz so I just maxed it out. Two images of the Moon were added.

### Card image hover
The 'responsive-img' component was updated to have a hover image data attribute, a data-title for the base image's title, and a data-hovertitle, for the hover images title, all using Handlebars.

category.js was updated to watch for updates to hover state of the card image using jQuery, updating the srcset and the title on hover, and returning to the original image and title when the mouse is removed from the context.

### Add All to Cart
A button was added to the category template with the text 'Add All to Cart', this button uses handlebars to set the attribute data-productids to a list of all the product IDs on the page. When the button is clicked, javascript turns that attribute into an array and the array is looped over, making StoreFront api calls to add each product to the cart.

While this is happening, the add all button is disabled, and the text is changed to 'Adding Items to Cart...' to follow the design of the product page add item button.

After items have all been added, the button returns to its original non-disabled state and text, the cart pillCount is updated, and the user is notified of the new cart status.

### Remove All from Cart
A button was added to the category template with the text 'Remove All Items', to implement this feature, first a new helper function was added to category.js that fetches the cart. If the fetched JSON is non-existant (the cart does not exist because it is empty), the button does not display.

When the remove items button is clicked, the text of the button is changed and the button is disabled, then the current cart is fetched and deleted using the StoreFront API.

After all items have been deleted, the button returns to its original non-disabled state and text, and the cart pillCount is set to 0, making it hidden.

The only non-page chaning cart add is the add all from category, so the button is set to display when the add all is completed.

### Display logged in user details
When a user is logged in, handlebars displays the users name, id, email, and if added, phone number.


#### License

(The MIT License)
Copyright (C) 2015-present BigCommerce Inc.
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
