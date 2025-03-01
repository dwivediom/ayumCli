import React from "react";
import { AccountContext } from "../../context/AccountProvider";
import { useContext } from "react";
import { useEffect } from "react";

const Nashamukti = () => {
  const { setscrollbox } = useContext(AccountContext);
  useEffect(() => {
    let indexbox = document.getElementById("nashamuktipage");
    // console.log(indexbox.scrollTop);
    indexbox.addEventListener("scroll", () => {
      let scrollTop = indexbox.scrollTop;
      if (scrollTop > 0) {
        setscrollbox(false);
      } else {
        setscrollbox(true);
      }
    });
  }, []);
  return (
    <div id="nashamuktipage" style={{ userSelect: "none" }}>
      <h1
        style={{
          fontSize: "1.5rem",
          borderBottom: "1px solid black",
        }}
        className="text-center w-full text-lg font-bold  p-3"
      >
        नशामुक्ति: स्वस्थ जीवन का आधार।
      </h1>
      <p className="text-left w-[70%] m-auto mt-8">
        नशामुक्ति विज्ञान के पैरामीटरों पर आधारित एक व्यावसायिक प्रक्रिया है जो
        एक व्यक्ति को उसकी नशीली आदतों से मुक्त कराने के लिए उन्हें सही तकनीक और
        मार्गदर्शन प्रदान करती है। नशामुक्ति वैज्ञानिक तकनीकों, मनोवैज्ञानिक
        तकनीकों और चिकित्सा विज्ञान के सिद्धांतों पर आधारित होती है। <br /> इस
        प्रक्रिया के लिए वैज्ञानिक दृष्टिकोण से, नशामुक्ति उपचार की भौतिक
        तकनीकों का उपयोग करती है जो मद्य, तंबाकू और अन्य नशीले पदार्थों के
        आसक्ति के लिए उपयोगी होती हैं। ये उपचार मानसिक अवस्थाओं को विशेष ध्यान
        में रखते हुए व्यक्ति को सही राह दिखाते हैं जिससे उन्हें नशे से निपटने
        में मदद मिलती है।
      </p>
      <p className="text-left w-[70%] m-auto mt-8">
        बढ़ोतरी होती है जो ब्रेन के स्वस्थ फंक्शनिंग को पुनः स्थापित करती है।
        अन्य अध्ययनों में यह साबित किया गया है कि नशेड़ी दवाओं के सेवन से ब्रेन
        की विषाणु क्रिया में परिवर्तन होता है जो ब्रेन की स्वस्थ फंक्शनिंग पर
        बुरा असर डालता है। इसके अलावा, नशे से प्रभावित होने से ब्रेन के सेंट्रल
        नर्वस सिस्टम के साथ-साथ अन्य अंगों पर भी बुरा प्रभाव पड़ता है। नशे से
        गुजरते समय शरीर में उच्च मात्रा में वायु प्रवाह होता है, जो जीवन के लिए
        अति हानिकारक होता है। इससे नशे से प्रभावित होने वाले लोगों को फिजिकल और
        मानसिक रूप से कमजोर महसूस होते हैं और वे अनेक समस्याओं से गुजरने लगते
        हैं। इसलिए, नशामुक्ति बहुत महत्वपूर्ण है ताकि शरीर और मन दोनों की स्वस्थ
        रहे। नशामुक्ति से लोग अपने जीवन को नई दिशा दे सकते हैं जो उन्हें स्वस्थ
        जीवन और समृद्धि की ओर ले जाती है।
      </p>
    </div>
  );
};

export default Nashamukti;
