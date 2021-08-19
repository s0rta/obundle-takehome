import { hooks } from "@bigcommerce/stencil-utils";
import CatalogPage from "./catalog";
import compareProducts from "./global/compare-products";
import FacetedSearch from "./common/faceted-search";
import { createTranslationDictionary } from "../theme/common/utils/translations-utils";

export default class Category extends CatalogPage {
  constructor(context) {
    super(context);
    this.validationDictionary = createTranslationDictionary(context);
  }

  getCurrentCart() {
    return fetch('/api/storefront/cart', {
      credentials: 'include'
    }).then(function(response) {
      return response.json();
    })
  }

  setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
    $element.attr({
      role: roleType,
      "aria-live": ariaLiveStatus,
    });
  }

  makeShopByPriceFilterAccessible() {
    if (!$("[data-shop-by-price]").length) return;

    if ($(".navList-action").hasClass("is-active")) {
      $("a.navList-action.is-active").focus();
    }

    $("a.navList-action").on("click", () =>
      this.setLiveRegionAttributes(
        $("span.price-filter-message"),
        "status",
        "assertive"
      )
    );
  }

  onReady() {
    this.arrangeFocusOnSortBy();

    $('[data-button-type="add-cart"]').on("click", (e) =>
      this.setLiveRegionAttributes(
        $(e.currentTarget).next(),
        "status",
        "polite"
      )
    );

    this.makeShopByPriceFilterAccessible();

    compareProducts(this.context);

    if ($("#facetedSearch").length > 0) {
      this.initFacetedSearch();
    } else {
      this.onSortBySubmit = this.onSortBySubmit.bind(this);
      hooks.on("sortBy-submitted", this.onSortBySubmit);
    }

    $("a.reset-btn").on("click", () =>
      this.setLiveRegionsAttributes($("span.reset-message"), "status", "polite")
    );

    $(".card-figure").hover(
      function () {
        const image = $(this).find(".card-image");
        const newImg = image.attr("data-hoverimage");
        const newTitle = image.attr("data-hovertitle");
        if (newImg && newImg !== "") {
          image.attr("srcset", newImg);
          image.attr("title", newTitle);
        }
      },
      function () {
        const image = $(this).find(".card-image");
        const newImg = image.attr("data-srcset");
        const newTitle = image.attr("data-title")
        if (newImg && newImg !== "") {
          image.attr("srcset", newImg);
          image.attr("title", newTitle);
        }
      }
    );
    
    $("#add-all-to-cart").on("click", function() {
      const productIDs = $(this).attr("data-productids").split(" ");

      $(this).html("Adding to Cart...").prop("disabled", true);
      $(".cart-manipulation-status").html("")
      // minus one because handlebars each statement leads to extra space
      const loopLength = productIDs.length - 1

      for(let i = 0; i < loopLength; i++) {
        $.ajax({
          type:'GET',
          url: "/cart.php?action=add&product_id=" + productIDs[i],
          success: (data) => {
            if(i === loopLength - 1) {
              $("#delete-cart").removeClass("delete-cart--hidden")
              $(".cart-manipulation-status").html("All Items Added to Cart")
              $("#add-all-to-cart").html("Add Items to Cart").prop("disabled", false)
              $('body').triggerHandler('cart-quantity-update', +$(".cart-quantity").text() + loopLength);
            }
          }
        })
      }
    })
    
    $("#delete-cart").on("click", () => {
      $("#delete-cart").html("Removing Items...").prop("disabled", true);
      $(".cart-manipulation-status").html("")
      this.getCurrentCart().then(cart => {
        console.log(cart)
        return fetch("/api/storefront/carts/"+cart[0].id, {
          method: "DELETE"
        })
      }).then(requrestReturn => {
        $(".cart-manipulation-status").html("All Items Removed from Cart")
        $("#delete-cart").addClass("delete-cart--hidden").html("Remove All Items").prop("disabled", false)
        $('body').triggerHandler('cart-quantity-update', 0);
      })
    })

    this.getCurrentCart().then(cart => {
      if(cart.length !== 0) {
        $("#delete-cart").removeClass("delete-cart--hidden")
      }
    })

    this.ariaNotifyNoProducts();
  }

  ariaNotifyNoProducts() {
    const $noProductsMessage = $("[data-no-products-notification]");
    if ($noProductsMessage.length) {
      $noProductsMessage.focus();
    }
  }

  initFacetedSearch() {
    const {
      price_min_evaluation: onMinPriceError,
      price_max_evaluation: onMaxPriceError,
      price_min_not_entered: minPriceNotEntered,
      price_max_not_entered: maxPriceNotEntered,
      price_invalid_value: onInvalidPrice,
    } = this.validationDictionary;
    const $productListingContainer = $("#product-listing-container");
    const $facetedSearchContainer = $("#faceted-search-container");
    const productsPerPage = this.context.categoryProductsPerPage;
    const requestOptions = {
      config: {
        category: {
          shop_by_price: true,
          products: {
            limit: productsPerPage,
          },
        },
      },
      template: {
        productListing: "category/product-listing",
        sidebar: "category/sidebar",
      },
      showMore: "category/show-more",
    };

    this.facetedSearch = new FacetedSearch(
      requestOptions,
      (content) => {
        $productListingContainer.html(content.productListing);
        $facetedSearchContainer.html(content.sidebar);

        $("body").triggerHandler("compareReset");

        $("html, body").animate(
          {
            scrollTop: 0,
          },
          100
        );
      },
      {
        validationErrorMessages: {
          onMinPriceError,
          onMaxPriceError,
          minPriceNotEntered,
          maxPriceNotEntered,
          onInvalidPrice,
        },
      }
    );
  }
}
