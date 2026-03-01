import Image from "next/image";

interface ProjectCardProps {
  image: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function ProjectCard({
  image,
  title,
  subtitle,
  onClick,
}: ProjectCardProps) {
  return (
    <>
      <div className="cursor-pointer group" onClick={onClick}>
        <div className="relative w-full aspect-[100/140] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover grayscale contrast-[1.15] brightness-[1.1]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Indigo duotone wash */}
          <div className="project-card-wash absolute inset-0 bg-[rgba(80,90,170,0.40)] mix-blend-multiply transition-[background] duration-400 pointer-events-none" />
          {/* Indigo tint overlay */}
          <div className="project-card-tint absolute inset-0 bg-[rgba(110,120,200,0.18)] transition-[background] duration-400 pointer-events-none" />
          {/* Name overlay — visible on touch, hover on desktop */}
          <div className="project-card-label absolute inset-0 flex flex-col items-center justify-center text-center p-5 transition-opacity duration-300 pointer-events-none z-[5]">
            <h3 className="text-[clamp(15px,2vw,22px)] font-medium text-white uppercase tracking-[0.08em] leading-[1.3]">
              {title}
            </h3>
            <span className="text-[11px] font-light text-white/65 uppercase tracking-[0.1em] mt-[6px]">
              {subtitle}
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Touch devices: always show label subtly */
        @media (hover: none) {
          .project-card-label {
            opacity: 0.85;
          }
        }
        /* Pointer devices: show on hover only */
        @media (hover: hover) {
          .project-card-label {
            opacity: 0;
          }
          .group:hover .project-card-label {
            opacity: 1;
          }
          .group:hover .project-card-wash {
            background: rgba(215, 155, 120, 0.60);
          }
          .group:hover .project-card-tint {
            background: rgba(240, 195, 165, 0.25);
          }
        }
      `}</style>
    </>
  );
}
