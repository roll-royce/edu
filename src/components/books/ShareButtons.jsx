import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton, 
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

export const ShareButtons = ({ url, title, description }) => {
  const shareDescription = description || `Check out this book: ${title} on BookNest`;
  
  return (
    <div className="flex justify-center space-x-3">
      <FacebookShareButton url={url} quote={shareDescription}>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <i className="bi bi-facebook text-blue-600 text-xl"></i>
        </div>
      </FacebookShareButton>
      
      <TwitterShareButton url={url} title={shareDescription}>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <i className="bi bi-twitter text-blue-400 text-xl"></i>
        </div>
      </TwitterShareButton>
      
      <LinkedinShareButton url={url} title={title} summary={shareDescription}>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
          <i className="bi bi-linkedin text-blue-700 text-xl"></i>
        </div>
      </LinkedinShareButton>
      
      <WhatsappShareButton url={url} title={shareDescription}>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
          <i className="bi bi-whatsapp text-green-500 text-xl"></i>
        </div>
      </WhatsappShareButton>
      
      <EmailShareButton url={url} subject={title} body={`Check out this book: ${title}\n\n${url}`}>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <i className="bi bi-envelope text-gray-600 dark:text-gray-400 text-xl"></i>
        </div>
      </EmailShareButton>
    </div>
  );
};
