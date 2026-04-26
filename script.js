// Menu Data
const menuData = [
    { id: 1, name: 'Ethiopian Yirgacheffe', price: 650, desc: 'Light roast with floral and citrus notes.' },
    { id: 2, name: 'Colombian Supremo', price: 550, desc: 'Medium roast, balanced with caramel sweetness.' },
    { id: 3, name: 'Sumatra Mandheling', price: 700, desc: 'Dark roast, earthy and full-bodied.' },
    { id: 4, name: 'Signature Espresso Blend', price: 450, desc: 'Rich crema, notes of dark chocolate.' },
    { id: 5, name: 'Vanilla Bean Latte', price: 575, desc: 'Espresso with steamed milk and real vanilla.' },
    { id: 6, name: 'Cold Brew Reserve', price: 600, desc: 'Steeped for 24 hours, ultra-smooth.' }
];

let cart = [];

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const trackingStatus = document.getElementById('trackingStatus');
const reviewForm = document.getElementById('reviewForm');
const reviewsContainer = document.getElementById('reviewsContainer');

// Initialize Menu
function initMenu() {
    menuData.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <span class="price">₹${item.price.toFixed(2)}</span>
            <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Cart Functions
function addToCart(id) {
    const item = menuData.find(i => i.id === id);
    const existingItem = cart.find(i => i.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    
    // Animate cart icon
    const icon = document.querySelector('.cart-icon i');
    icon.style.transform = 'scale(1.3)';
    setTimeout(() => icon.style.transform = 'scale(1)', 200);
}

// Add function to global scope to be called from HTML
window.addToCart = addToCart;

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

window.removeFromCart = removeFromCart;

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').innerText = count;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name} x${item.quantity}</h4>
                    <span style="color:var(--text-muted)">$${itemTotal.toFixed(2)}</span>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    cartTotalAmount.innerText = `$${total.toFixed(2)}`;
}

// Event Listeners
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

closeSuccessBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    const address = document.getElementById('deliveryAddress').value;
    if (!address) {
        alert("Please enter a delivery address.");
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Simulate checkout process
    cartModal.classList.remove('active');
    successModal.classList.add('active');
    
    // Simulate order tracking updates
    let steps = ['Preparing...', 'Brewing...', 'Out for Delivery', 'Delivered'];
    let currentStep = 0;
    
    trackingStatus.innerText = steps[currentStep];
    trackingStatus.style.background = 'var(--gold)';
    
    const interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length) {
            trackingStatus.innerText = steps[currentStep];
            if(currentStep === steps.length - 1) {
                trackingStatus.style.background = '#2ed573'; // Green for delivered
                clearInterval(interval);
                
                // Reset cart
                cart = [];
                updateCartUI();
                document.getElementById('deliveryAddress').value = '';
            }
        }
    }, 3000); // Update every 3 seconds for demo
});

// Handle Review Submission
reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value;
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value;
    
    let stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <div class="stars">${stars}</div>
        <p>"${text}"</p>
        <h4>- ${name}</h4>
    `;
    
    reviewsContainer.prepend(reviewCard);
    
    // Reset form
    reviewForm.reset();
    alert("Thank you for your review!");
});

// Initialize
initMenu();
