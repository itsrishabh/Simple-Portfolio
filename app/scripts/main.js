'use strict';

var PortfolioURL = '/portfolio.json';
var windowHeight = $(window).height();
var windowWidth = $(window).width();
var hamburger = $('#hamburger');
var mobileMenu = $('.navigation-overlay');
var mobileMenuClose = $('#mobile-close');

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

(function() {
    if (isMobile.any() === false || windowWidth > 500) {
        hamburger.on('click tap', function() {
            var hamburgerIconClass = $(this).find('i');
            hamburgerIconClass.toggleClass('icon-close icon-menu');
            if (hamburgerIconClass.hasClass('icon-close')) {
                $('.navigation').addClass('light-shadow');
                $('.navigation').removeClass('light-shadow-remove');
                $('.navigation-hidden').addClass('fadeInDown').show();
                $('.me-content').addClass('content-slide-down');
            } else {
                $('.navigation-hidden').hide();
                $('.navigation').addClass('light-shadow-remove');
                $('.me-content').removeClass('content-slide-down');
            }
            return false;
        });
    } else {
        hamburger.on('click tap', function() {
            $('body').addClass('no-scroll');
            $('.navigation-overlay').show();
        });
        $(document).keyup(function(e) {
            if (e.keyCode == 27) {
                closeMobileMenu();
            }
        });
        mobileMenuClose.on('click tap', function() {
            closeMobileMenu();
        });
        mobileMenu.find('a').on('click tap', function() {
            closeMobileMenu();
        });
    }

    $('header').headroom({
        'offset': 80,
        'classes': {
            'initial': 'animated',
            'pinned': 'slideInDown',
            'unpinned': 'slideOutUp'
        }
    });

    var Items = Backbone.Model.extend();

    var ItemsCollection = Backbone.Collection.extend({
        model: Items,
        url: PortfolioURL,
        initialize: function() {
            this.fetch({
                success: this.fetchSuccess,
                error: this.fetchError
            });
        },

        fetchSuccess: function(collection, response) {
            // console.log('Collection fetch success', response);
            // console.log(collection);
        },

        fetchError: function(collection, response) {
            throw new Error('Something went wrong fetching the collection');
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            '': 'homeRoute',
            'view/:id': 'viewRoute',
            '*default': 'homeRoute'
        },
        homeRoute: function() {
            console.log('On Home Page');
            var homeView = Backbone.View.extend({
                initialize: function() {
                    this.collection = new ItemsCollection();
                    this.collection.bind("reset", _.bind(this.render, this));
                    this.render();
                },
                render: function() {
                    var that = this;
                    this.collection.fetch({
                        success: function(collection) {
                            var source = $('#template-home').html();
                            var template = Handlebars.compile(source);
                            var html = template(that.collection.toJSON());
                            that.$el.html(html);
                        }
                    });
                    return that;
                }
            });
            var HomeView = new homeView();
            $("#content").html(HomeView.el);
        },
        viewRoute: function() {
            console.log('Viewing Items Stats');
            var itemsView = Backbone.View.extend({
                initialize: function() {
                    console.log(ItemsCollection);
                    // this.render();
                },
                render: function() {
                    var source = $('#template-view').html();
                    var template = Handlebars.compile(source);
                    var html = template(ItemsCollected.toJSON());
                    this.$el.html(html);
                }
            });
            var ItemsView = new itemsView();
            $("#content").html(ItemsView.el);
        }
    });
    var router = new Router();
    Backbone.history.start();
    smoothScroll();
})();

function closeMobileMenu() {
    mobileMenu.addClass('fadeOutDown');
    setTimeout(function() {
        mobileMenu.removeClass('fadeOutDown').hide();
    }, 500);
    $('body').removeClass('no-scroll');
}

function smoothScroll() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 500);
                $('.me-content').removeClass('content-slide-down');
                return false;
            }
        }
    });
    $('#top').click(function() {
        $('body, html').animate({
            scrollTop: 0
        }, 250);
        return false;
    });
}
