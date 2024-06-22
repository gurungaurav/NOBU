import PropTypes from "prop-types";

export default function BlogPostsCard({ picture, blogTag, content, title }) {
  return (
    <div className="flex flex-col border shadow-lg cursor-pointer transition-transform duration-300 transform-gpu hover:shadow-md hover:-translate-y-1">
      <div className="h-[15rem] border">
        <img
          className="h-full w-full object-cover"
          src={picture}
          alt="blogPic"
        />
      </div>
      <div className="flex flex-col pl-5 pr-5 pt-2 pb-8 h-[12rem]">
        <p className="text-violet-950 font-semibold text-xl ">{blogTag}</p>
        <div className="">
          <p className="items-center font-bold text-xl line-clamp-3 tracking-wide uppercase">
            {title}
          </p>
          <div className="text-neutral-500 font-semibold overflow-hidden line-clamp-2 text-xs  mt-3">
            <p>
              {content} dbibfbds fihsdf sdbfygds fsdyufg dshbfyusd g dfds sdfg
              sudg disfsd fgdsyg fsd gfgyd dshfgdsygfydsg
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
BlogPostsCard.propTypes = {
  picture: PropTypes.string.isRequired,
  blogTag: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
