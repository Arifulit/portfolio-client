// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();
    
//     // This is a mock authentication. In a real app, you would check against a database
//     if (email === 'admin@portfolio.com' && password === 'admin123456') {
//       const user = {
//         id: '1',
//         email: email,
//         name: 'Admin User'
//       };
      
//       // In a real app, you would generate a JWT token here
//       const token = 'sample-jwt-token';
      
//       return NextResponse.json({
//         success: true,
//         token,
//         user
//       });
//     }
    
//     return NextResponse.json(
//       { success: false, message: 'Invalid credentials' },
//       { status: 401 }
//     );
    
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: 'An error occurred during login' },
//       { status: 500 }
//     );
//   }
// }
