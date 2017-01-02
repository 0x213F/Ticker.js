# Ticker.js

Ticker.js is a light-weight UI component for scrolling text inspired by [Robinhood](https://github.com/robinhood/ticker) that has no dependencies.

## Quick Start

To get started, include the `ticker.min.css` and `ticker.min.js` files in your project. Then, wrap your dynamic text in a tag with an id:

```
<p id="price">$39.25</p>
```

Once the D.O.M. has loaded, you can make an instance of the ticker with the following:

```
/*
 * Ticker(id, alphabet, transition)
 *
 * id                    - the id of the text
 * alphabet              - an array of the alphabet used for the ticker
 * transition - optional - time in ms for the transition
 */

var price = new Ticker("price", ['$','.','0','1','2','3','4','5','6','7','8','9'], 500);
```

To update the ticker with a new value call the following method:

```
price.update("41.10");
```
### Limitations

This works best with monospace fonts and can only handle fixed length strings.


## Author

**Joshua Schultheiss**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
