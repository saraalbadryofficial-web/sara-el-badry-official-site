(function(){
  const CFG = window.SARA_CONFIG || {};
  const body = document.body;
  const book = {
    id: body.dataset.bookId || "",
    name: body.dataset.bookName || "",
    year: body.dataset.bookYear || "",
    type: body.dataset.bookType || ""
  };

  function injectTracking(){
    if(CFG.ga4Id){
      const s=document.createElement("script");
      s.async=true;
      s.src=`https://www.googletagmanager.com/gtag/js?id=${CFG.ga4Id}`;
      document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];
      window.gtag=function(){dataLayer.push(arguments)};
      gtag("js",new Date());
      gtag("config",CFG.ga4Id);
    }
    if(CFG.metaPixel){
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
      fbq("init",CFG.metaPixel);
      fbq("track","PageView");
    }
  }

  function track(name,params={}){
    if(window.gtag) gtag("event",name,params);
    if(window.fbq){
      if(name==="view_book") fbq("track","ViewContent",params);
      else if(name==="click_buy"){
        fbq("track","InitiateCheckout",params);
        fbq("trackCustom","click_buy",params);
      } else fbq("trackCustom",name,params);
    }
  }

  document.addEventListener("DOMContentLoaded",function(){
    injectTracking();
    const params={book_id:book.id,book_name:book.name,book_year:book.year,book_type:book.type};
    setTimeout(()=>track("view_book",params),150);

    document.querySelectorAll("[data-buy-channel]").forEach(a=>{
      a.addEventListener("click",()=>track("click_buy",{
        book_id:book.id,book_name:book.name,channel:a.dataset.buyChannel||"external"
      }));
    });

    const marks=[25,50,75,90], sent=new Set();
    addEventListener("scroll",()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      if(max<=0)return;
      const p=Math.round(scrollY/max*100);
      marks.forEach(m=>{
        if(p>=m&&!sent.has(m)){
          sent.add(m);
          track("scroll_depth",{percent:m,book_id:book.id,book_name:book.name});
        }
      });
    },{passive:true});
  });
})();
