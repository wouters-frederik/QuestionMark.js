# QuestionMark.js

When the user pushes the `?` key, QuestionMark.js triggers a modal window that displays keyboard shortcuts for your app &mdash; similar to what happens on Twitter, Gmail, GitHub, etc. [Hat tip to Robert Nyman](https://plus.google.com/u/0/118100898483063383963/posts/V12mRNmsiWg). The modal is removed when the `ESC` key is pushed or the user clicks behind the modal.

# original project
this is a fork of https://github.com/impressivewebs/QuestionMark.js

# improvements

* Choose the target div via parameter
* Choose which html to show in keyboard "popup"
* Use the Jquery annotation:
```
  jQuery.questionmark(
    {
        'html_location' : '/youtcustompath/question.mark.html',
        'target_id': 'youtcustom_helpTarget'
    }
    );
    
```

# License
I'm giving this a [CC 2.0](http://creativecommons.org/licenses/by/2.0/). You don't have to credit me for it, but you can do so if you wish.
