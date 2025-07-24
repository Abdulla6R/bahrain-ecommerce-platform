export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #FFA500 0%, #FFE135 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '2rem'
      }}>
        <h1 style={{
          fontSize: '4rem',
          margin: '0 0 1rem 0',
          background: 'linear-gradient(135deg, #FFA500, #FFE135)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          تندز | Tendzd
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#666',
          margin: '0 0 2rem 0',
          lineHeight: '1.6'
        }}>
          🎉 السيرفر يعمل بنجاح!<br/>
          Server is Working Successfully!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '10px',
            border: '2px solid #FFE135'
          }}>
            <h3 style={{ color: '#FFA500', margin: '0 0 0.5rem 0' }}>✅ Arabic RTL</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              النصوص العربية تعمل بشكل صحيح
            </p>
          </div>
          
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '10px',
            border: '2px solid #FFE135'
          }}>
            <h3 style={{ color: '#FFA500', margin: '0 0 0.5rem 0' }}>💰 Bahrain VAT</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              10% VAT Ready
            </p>
          </div>
          
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '10px',
            border: '2px solid #FFE135'
          }}>
            <h3 style={{ color: '#FFA500', margin: '0 0 0.5rem 0' }}>🏪 Multi-Vendor</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Database Ready
            </p>
          </div>
        </div>

        <div style={{
          background: '#FFF3E0',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid #FFE135',
          marginBottom: '1rem'
        }}>
          <h3 style={{ color: '#E65100', margin: '0 0 0.5rem 0' }}>🌐 Test & Demo Pages:</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <a href="/demo" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              🎨 Interactive Demo: /demo
            </a>
            <a href="/test" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              🧪 Comprehensive Tests: /test
            </a>
            <a href="/checkout" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              🛒 Full Checkout Flow: /checkout
            </a>
            <a href="/auth/register" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              👤 User Registration: /auth/register
            </a>
            <a href="/vendor/dashboard" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              🏪 Vendor Dashboard: /vendor/dashboard
            </a>
            <a href="/vendor/onboarding" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              📝 Vendor Onboarding: /vendor/onboarding
            </a>
            <a href="/account" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              👤 User Account System: /account
            </a>
            <a href="/admin" style={{ 
              display: 'block', 
              fontFamily: 'monospace', 
              background: 'white', 
              padding: '0.5rem', 
              borderRadius: '5px',
              textDecoration: 'none',
              color: '#1976d2',
              border: '1px solid #E3F2FD'
            }}>
              🔧 Admin Dashboard: /admin
            </a>
          </div>
        </div>

        <p style={{ 
          fontSize: '1rem', 
          color: '#888',
          margin: '1rem 0 0 0'
        }}>
          🎉 Phase 4 Complete: Full Platform Ready!<br/>
          <small style={{ color: '#aaa' }}>Complete Multi-Vendor Platform: Next.js 15 + Mantine + Arabic Support + Bahrain Compliance + PWA + Performance Optimized</small>
        </p>
      </div>
    </div>
  );
}