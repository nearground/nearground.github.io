// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-bookshelf",
          title: "Bookshelf",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "nav-resume",
          title: "Resume",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "post-my-site-is-up-and-running-again",
        
          title: "My Site is Up and Running again",
        
        description: "Whoo!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/my-site-is-up-and-running-again/";
          
        },
      },{id: "post-how-to-create-a-personal-website-and-blog-for-free",
        
          title: "How To Create a Personal Website and Blog for Free",
        
        description: "How to build a blog on Github Pages",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/how-this-site-was-built/";
          
        },
      },{id: "books-2666",
          title: '2666',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/2666/";
            },},{id: "books-approaches-drugs-and-altered-states",
          title: 'Approaches: Drugs and Altered States',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/approaches-drugs-and-altered-states/";
            },},{id: "books-cat-39-s-cradle",
          title: 'Cat&amp;#39;s Cradle',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/cats-cradle/";
            },},{id: "books-el-laberinto-de-la-soledad",
          title: 'El Laberinto de la Soledad',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/el-laberinto-de-la-soledad/";
            },},{id: "books-eumeswil",
          title: 'Eumeswil',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/eumeswil/";
            },},{id: "books-ficciones",
          title: 'Ficciones',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/ficciones/";
            },},{id: "books-the-book-of-five-rings",
          title: 'The Book of Five Rings',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/five-rings/";
            },},{id: "books-getting-back-to-happy",
          title: 'Getting Back to Happy',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/getting-back-to-happy/";
            },},{id: "books-infinite-jest",
          title: 'Infinite Jest',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/infinite_jest/";
            },},{id: "books-invitation-to-a-beheading",
          title: 'Invitation to a Beheading',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/invitation-to-a-beheading/";
            },},{id: "books-the-key-of-dreams",
          title: 'The Key of Dreams',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/la-clef-des-songes/";
            },},{id: "books-laravel-up-and-running-3rd-edition",
          title: 'Laravel Up and Running (3rd Edition)',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/laravel-up-and-running/";
            },},{id: "books-on-the-marble-cliffs",
          title: 'On the Marble Cliffs',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/on-the-marble-cliffs/";
            },},{id: "books-oroonoko-or-the-royal-slave",
          title: 'Oroonoko, or the Royal Slave',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/oroonoko/";
            },},{id: "books-pale-fire",
          title: 'Pale Fire',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/pale_fire/";
            },},{id: "books-the-yoga-sutras-of-patanjali",
          title: 'The Yoga Sutras Of Patanjali',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/patanjali-sutras/";
            },},{id: "books-pedro-paramo",
          title: 'Pedro Paramo',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/pedro-paramo/";
            },},{id: "books-php-cookbook",
          title: 'PHP Cookbook',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/php-cookbook/";
            },},{id: "books-slaughterhouse-five",
          title: 'Slaughterhouse-Five',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/slaughterhouse-five/";
            },},{id: "books-storm-of-steel",
          title: 'Storm of Steel',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/storm-of-steel/";
            },},{id: "books-swann-39-s-way",
          title: 'Swann&amp;#39;s Way',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/swanns-way/";
            },},{id: "books-the-blind-owl",
          title: 'The Blind Owl',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-blind-owl/";
            },},{id: "books-the-brothers-karamazov",
          title: 'The Brothers Karamazov',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-brothers-karamazov/";
            },},{id: "books-the-forest-passage",
          title: 'The Forest Passage',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-forest-passage/";
            },},{id: "books-the-glass-bees",
          title: 'The Glass Bees',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-glass-bees/";
            },},{id: "books-the-idiot",
          title: 'The Idiot',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-idiot/";
            },},{id: "books-the-luzhin-defense",
          title: 'The Luzhin Defense',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-luzhin-defense/";
            },},{id: "books-the-neverending-story",
          title: 'The Neverending Story',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-neverending-story/";
            },},{id: "books-the-power-of-now",
          title: 'The Power of Now',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-power-of-now/";
            },},{id: "books-the-three-body-problem",
          title: 'The Three-Body Problem',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-three-body-problem/";
            },},{id: "books-the-unfettered-mind",
          title: 'The Unfettered Mind',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the-unfettered-mind/";
            },},{id: "books-tropic-of-cancer",
          title: 'Tropic Of Cancer',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/tropic-of-cancer/";
            },},{id: "books-las-venas-abiertas-de-américa-latina",
          title: 'Las venas abiertas de América Latina',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/venas-abiertas-de-latinoamerica/";
            },},{id: "news-open-for-work",
          title: 'Open for work',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/2025-07-25-open-for-work/";
            },},{id: "news-will-this-test-work",
          title: 'Will this test work?',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/will-this-test-work/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6D%75%6E%67%75%6F%6C%6D@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/nearground", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/martin-munguia", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-spotify',
        title: 'Spotify',
        section: 'Socials',
        handler: () => {
          window.open("https://open.spotify.com/user/iyno8n4zl419pwtxxtmd15xvu", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
