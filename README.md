## Website Performance Optimization

###Optimize the pages for PSI>=90
1. Checkout repo
2. `npm install`
3. `gulp serve:dist` will render the production version of the code base.
4. Above command will also serve out a ngrok url which can be tested in PSI website.
[PSI.png./]

####Tricks used update page speed : 
- Imagemin for compressed images
- gulp-cache for caching images
- uglify and cssnano for js and css min
- inline critical css.

####Part 2: Optimize Frames per Second in pizza.html
- Code rewrite when redrawing pizza on slider change
- Clean up with getElementsByClassName
- ComplexMath handled outside loop, major updates in translate and %5 tricks in **updatePositions**
- Throttle animations on scroll https://developer.mozilla.org/en-US/docs/Web/Events/scroll

Search with --Update-- in the codebase to find above code changes.
