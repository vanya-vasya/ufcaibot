"use client";

import FortuneInsightsSection from "@/components/insights/FortuneInsightsSection";

const BlogPage = () => {
  return (
    <div className="bg-white relative" style={{'--contact-font': 'Inter, system-ui, -apple-system, sans-serif'} as React.CSSProperties & {'--contact-font': string}}>
      {/* Fortune Health Insights Section */}
      <div style={{ marginTop: '80px' }}>
        <FortuneInsightsSection className="bg-white pt-24" />
      </div>
      
      <style jsx global>{`
        /* Ensure header has proper z-index and positioning */
        header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          background: white !important;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Ensure body has proper scroll behavior */
        body {
          padding-top: 0 !important;
        }
        
        /* Ensure all nav links are clickable */
        .nav-link {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        
        /* Ensure dropdown works properly */
        .dropdown-menu {
          z-index: 10000 !important;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
