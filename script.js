let cart = [];
        let currentDesign = {
            type: '',
            color: '',
            pattern: '',
            fabric: ''
        };

        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
        }

        function addToCart(productName) {
            // Check if user is logged in (simplified check)
            const isLoggedIn = localStorage.getItem('userLoggedIn');
            
            if (!isLoggedIn) {
                alert('Please sign up or login to add items to cart');
                showPage('signup');
                return;
            }
            
            cart.push({
                name: productName,
                price: Math.floor(Math.random() * 5000) + 999,
                id: Date.now()
            });
            
            updateCartDisplay();
            alert(`${productName} added to cart!`);
        }

        function updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                        <p style="font-size: 1.2rem; color: #666; margin-bottom: 2rem;">Your cart is empty</p>
                        <a href="#" class="cta-button" onclick="showPage('shop')">Continue Shopping</a>
                    </div>
                `;
                return;
            }
            
            let cartHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                total += item.price;
                cartHTML += `
                    <div style="background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="color: #333; margin-bottom: 0.5rem;">${item.name}</h3>
                            <p style="color: #c44569; font-weight: 600; font-size: 1.2rem;">₹${item.price}</p>
                        </div>
                        <button onclick="removeFromCart(${item.id})" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Remove</button>
                    </div>
                `;
            });
            
            cartHTML += `
                <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-top: 2rem; text-align: center;">
                    <h3 style="color: #333; margin-bottom: 1rem;">Total: ₹${total}</h3>
                    <button class="cta-button" onclick="proceedToPayment()" style="margin-right: 1rem;">Proceed to Payment</button>
                    <a href="#" class="back-button" onclick="showPage('shop')">Continue Shopping</a>
                </div>
            `;
            
            cartItems.innerHTML = cartHTML;
        }

        function removeFromCart(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            updateCartDisplay();
        }

        function proceedToPayment() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Update payment page with cart details
            const totalItems = cart.length;
            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            const total = subtotal + 99; // Adding shipping
            
            document.getElementById('totalItems').textContent = totalItems;
            document.getElementById('subtotal').textContent = subtotal;
            document.getElementById('total').textContent = total;
            
            showPage('payment');
        }

        function updateDesign(property, value) {
            currentDesign[property] = value;
            const canvas = document.getElementById('designCanvas');
            
            let designText = 'Your Custom Design:\n';
            if (currentDesign.type) designText += `Type: ${currentDesign.type}\n`;
            if (currentDesign.color) designText += `Color: ${currentDesign.color}\n`;
            if (currentDesign.pattern) designText += `Pattern: ${currentDesign.pattern}\n`;
            if (currentDesign.fabric) designText += `Fabric: ${currentDesign.fabric}\n`;
            
            if (Object.values(currentDesign).some(val => val)) {
                canvas.innerHTML = designText.replace(/\n/g, '<br>');
                canvas.style.background = currentDesign.color || '#f8f9fa';
                canvas.style.color = currentDesign.color ? '#fff' : '#666';
            }
        }

        function saveDesign() {
            if (!Object.values(currentDesign).some(val => val)) {
                alert('Please select some design options first!');
                return;
            }
            
            alert('Design saved! You can now add it to your cart or continue customizing.');
        }

        function trackOrder() {
            const orderId = document.getElementById('orderIdInput').value;
            if (!orderId) {
                alert('Please enter an order ID');
                return;
            }
            
            document.getElementById('displayOrderId').textContent = orderId;
            document.getElementById('trackingResult').style.display = 'block';
        }

        // Form submissions
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profile saved successfully! Your measurements will be used for perfect fit recommendations.');
        });

        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you within 24 hours.');
        });

        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('userLoggedIn', 'true');
            alert('Account created successfully! You can now add items to cart.');
            showPage('home');
        });

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('userLoggedIn', 'true');
            alert('Login successful! Welcome back to HerElegance.');
            showPage('home');
        });

        document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Order placed successfully! You will receive a confirmation email shortly.');
            cart = []; // Clear cart
            updateCartDisplay();
            showPage('track');
        });

        document.getElementById('feedbackForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your feedback! Your input helps us improve our services.');
            e.target.reset();
        });