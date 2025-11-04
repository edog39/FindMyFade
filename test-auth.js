// Test authentication system
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'test1234';

console.log('🧪 Testing Authentication System\n');
console.log('Test Email:', testEmail);
console.log('Test Password:', testPassword);
console.log('\n' + '='.repeat(50) + '\n');

// Test 1: Signup as Client
async function testClientSignup() {
  console.log('📝 TEST 1: Client Signup');
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Client',
        email: testEmail,
        phone: '555-0001',
        password: testPassword,
        userType: 'client',
        preferences: ['Fades', 'Tapers']
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Client signup successful!');
      console.log('   User ID:', data.user.id);
      console.log('   Email:', data.user.email);
      console.log('   Type:', data.user.userType);
    } else {
      console.log('❌ Client signup failed!');
      console.log('   Error:', data.error);
      console.log('   Details:', data.details || 'None');
    }
    
    return response.ok;
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Test 2: Login as Client
async function testClientLogin() {
  console.log('\n📝 TEST 2: Client Login');
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Client login successful!');
      console.log('   User ID:', data.user.id);
      console.log('   Name:', data.user.firstName, data.user.lastName);
      console.log('   Type:', data.user.userType);
    } else {
      console.log('❌ Client login failed!');
      console.log('   Error:', data.error);
    }
    
    return response.ok;
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Test 3: Signup as Barber
async function testBarberSignup() {
  const barberEmail = `barber${Date.now()}@example.com`;
  
  console.log('\n📝 TEST 3: Barber Signup');
  console.log('   Email:', barberEmail);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Barber',
        email: barberEmail,
        phone: '555-0002',
        password: testPassword,
        userType: 'barber',
        shopName: 'Test Barbershop',
        address: '123 Test St, Test City, TS 12345',
        experience: '3-5',
        specialties: ['Fades', 'Beard Trim'],
        bio: 'Test barber profile'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Barber signup successful!');
      console.log('   User ID:', data.user.id);
      console.log('   Barber Profile ID:', data.user.barberProfileId);
      console.log('   Type:', data.user.userType);
    } else {
      console.log('❌ Barber signup failed!');
      console.log('   Error:', data.error);
      console.log('   Details:', data.details || 'None');
    }
    
    return { success: response.ok, email: barberEmail };
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return { success: false, email: barberEmail };
  }
}

// Test 4: Login as Barber
async function testBarberLogin(email) {
  console.log('\n📝 TEST 4: Barber Login');
  console.log('   Email:', email);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: testPassword
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Barber login successful!');
      console.log('   User ID:', data.user.id);
      console.log('   Name:', data.user.firstName, data.user.lastName);
      console.log('   Type:', data.user.userType);
      console.log('   Barber Profile ID:', data.user.barberProfile?.id);
    } else {
      console.log('❌ Barber login failed!');
      console.log('   Error:', data.error);
    }
    
    return response.ok;
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('⏳ Waiting for server to be ready...\n');
  
  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Check if server is running
    const healthCheck = await fetch('http://localhost:3000/');
    if (!healthCheck.ok) {
      console.log('❌ Server not responding at http://localhost:3000');
      console.log('   Make sure to run: npm run dev');
      process.exit(1);
    }
    console.log('✅ Server is running!\n');
  } catch (error) {
    console.log('❌ Cannot connect to server');
    console.log('   Make sure to run: npm run dev');
    process.exit(1);
  }
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Client Signup
  if (await testClientSignup()) passed++; else failed++;
  
  // Test 2: Client Login
  if (await testClientLogin()) passed++; else failed++;
  
  // Test 3: Barber Signup
  const barberResult = await testBarberSignup();
  if (barberResult.success) passed++; else failed++;
  
  // Test 4: Barber Login (only if signup succeeded)
  if (barberResult.success) {
    if (await testBarberLogin(barberResult.email)) passed++; else failed++;
  } else {
    console.log('\n⏭️  Skipping barber login test (signup failed)');
    failed++;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}/4`);
  console.log(`❌ Failed: ${failed}/4`);
  console.log('='.repeat(50));
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Authentication is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('\n💡 Tips:');
    console.log('   - Make sure DATABASE_URL is set in .env');
    console.log('   - Run: npx prisma db push');
    console.log('   - Check server logs for detailed errors');
  }
  
  process.exit(failed === 0 ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

