var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="container">
        <div class="product-wrap">
            <div class="product">
                <div class="product-img">
                    <img :src="image" alt="">
                </div>
            </div>
            <div class="product-info">
                <h1
                :class="{'activeClass': activeClass, 'errorClass': errorClass }"
                :style="{color: 'red'}"
                >{{title}}</h1>

                <p v-if="inStock"
                :style="{color: 'blue'}"
                >In Stock</p>
                <p v-else
                :style="{color: 'red'}"
                >Out of Stock</p>

                <p>Shipping is {{shipping}}</p>
                <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>

                <div class="color">
                    <div v-for="(variant,index) in variants" 
                        :key="variant.variantId"
                        class="color-box"
                        :style="{backgroundColor: variant.variantColor}"
                        @mouseover="updateProduct(index)"
                        >
                    </div>
                </div>

                <div class="cartwrap">
                    <button v-on:click="addToCart">add to cart</button>
                </div>
                
            </div>
        </div>

        <product-tab :reviews="reviews"></product-tab>
        
        
    </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            products: 'Socks',
            selectedVariant: 0,
            details: [
                '80% cotton',
                '20 % polyester',
                'Gender Neautral'
            ],
            styleObject: {
                fontSize: '50px',
                color: 'red'
            },
            styleObject2: {
                margin: '50px',
                padding: 'red'
            },
            activeClass: false,
            errorClass: false,
            variants: [
                {
                    variantId: 1212,
                    variantColor: 'green',
                    variantImage: './assets/images/green.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2322,
                    variantColor: 'blue',
                    variantImage: './assets/images/blue.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    }, 
    methods: {
        addToCart(id) {
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return this.brand + this.products;
        },
         image() {
             return this.variants[this.selectedVariant].variantImage;
         },
         inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
         },
         shipping() {
             if (this.premium) {
                 return "Free"
             }
             return 2.99
         }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" v-on:submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>please correct the following errors(s):</b>
                <ul>
                    <li v-for="error in errors"></li>
                </ul>

            </p>

            <p>
                <label for="name">Name:</label><br>
                <input id="name" v-model="name">
            </p>

            <p>
                <label for="review">Review:</label><br>
                <textarea id="review" v-model="review"></textarea>
            </p>

            <p>
                <label for="review">Rating</label>
                <select id="rating" v-model="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            rating: null,
            review: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.rating && this.review) {
                let productReview = {
                    name: this.name,
                    rating: this.rating,
                    review: this.review
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.rating = null
                this.review = null
                
            } else {
                if(!this.name) this.errors.push("name is required");
                if(!this.rating) this.errors.push('rating is required');
                if(!this.review) this.errors.push('review is required');
            }
        }
    }
})

Vue.component('product-tab', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                :class="{activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
                >
                {{tab}}
            </span>

            <div class="review">
                <div v-show="selectedTab === 'Reviews'">
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no review yet</p>
                    <ul>
                        <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>{{review.rating}}</p>
                        <p>{{review.review}}</p>
                        </li>
                    </ul>
                </div>
                <product-review v-show="selectedTab === 'Make a Review'"></product-review>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        }
    }
})
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }
    
})