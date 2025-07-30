
// Logging middleware integration
const logger = {
  log: async (stack, level, packageName, message) => {
    try {
      const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // You'll need to implement auth
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message
        })
      });
      
      if (!response.ok) {
        console.error('Logging failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logging error:', error);
    }
  }
};

export default logger;