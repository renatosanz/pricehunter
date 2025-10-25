import ContentLayout from "@/layouts/ContentLayout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Glasses,
  ShoppingBag,
  DrumstickIcon,
  ShoppingBasket,
  BookAIcon,
  CookieIcon,
  Car,
  Smartphone,
  Shirt,
  Footprints,
} from "lucide-react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import "./styles.css";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/stores/user-store";

export default function Dashboard() {
  const navigate = useNavigate();
  const { name } = useUserStore();
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xlscroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
        Bienvenido {name}
      </h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3  xl:grid">
        <CreateNewTrackerBanner nav={navigate} />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </ContentLayout>
  );
}

function CreateNewTrackerBanner({ nav }: { nav: NavigateFunction }) {
  const scroller_one = useRef<HTMLDivElement>(null);
  const scroller_two = useRef<HTMLDivElement>(null);
  const shouldAnimate = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;

  const productIcons = [
    Glasses,
    DrumstickIcon,
    ShoppingBasket,
    BookAIcon,
    CookieIcon,
    Car,
    Smartphone,
    Shirt,
    Footprints,
  ];
  const addAnimation = () => {
    if (scroller_one.current && scroller_two.current) {
      scroller_one.current.setAttribute("data-animated", "true");
      duplicateScrollerItems(scroller_one.current);
      scroller_two.current.setAttribute("data-animated", "true");
      duplicateScrollerItems(scroller_two.current);
    }
  };

  const duplicateScrollerItems = (scroller: HTMLDivElement) => {
    const scrollerInner = scroller.querySelector(".scroller__inner");
    if (!scrollerInner) return;

    const scrollerContent = Array.from(scrollerInner.children);
    if (scrollerContent.length === productIcons.length) {
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute("aria-hidden", "true");
        scrollerInner.appendChild(duplicatedItem);
      });
    }
  };

  const handleCreateTracker = () => {
    nav("/home/new-tracker");
  };

  useEffect(() => {
    if (shouldAnimate) {
      addAnimation();
    }
  });
  return (
    <Card className="bg-muted/50 aspect-video rounded-xl">
      <CardHeader>
        <CardTitle>¿Listo para rastrear?</CardTitle>
        <CardDescription>Más de 100 mil productos te esperan!</CardDescription>
        <CardAction>
          <Button onClick={handleCreateTracker}>
            <ShoppingBag />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div data-speed="fast" className="scroller" ref={scroller_one}>
          <ul className="tag-list scroller__inner">
            {productIcons.map((IconComponent, index) => (
              <li key={index}>
                <IconComponent />
              </li>
            ))}
          </ul>
        </div>
        <div
          data-speed="fast"
          data-direction="right"
          className="scroller"
          ref={scroller_two}
        >
          <ul className="tag-list scroller__inner">
            {productIcons.map((IconComponent, index) => (
              <li key={index}>
                <IconComponent />
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
