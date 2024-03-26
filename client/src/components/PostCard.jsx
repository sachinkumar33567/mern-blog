import { Link } from "react-router-dom";

export default function PostCard({post}) {
  return (
    <div className="group h-[320px] w-full border border-teal-500 hover:border-2
          transition-all relative overflow-hidden rounded-lg sm:w-[320px]">
        <Link to={`/post/${post.slug}`}>
            <img
            className="h-[200px] w-full object-cover group-hover:h-[160px]
            transition-all duration-300 z-20"
            src={post.image}
            alt={post.title} />
        </Link>
        <div className="p-3 flex flex-col gap-2">
            <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
            <span className="italic text-sm">{post.category}</span>
            <Link to={`/post/${post.slug}`}
            className=" absolute bottom-[-200px] group-hover:bottom-0 left-0 right-0
            border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white
            transition-all duration-300 text-sm text-center py-2 rounded-sm m-2">
                Read article
            </Link>
        </div>
    </div>
  )
}
