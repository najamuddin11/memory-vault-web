import { useEffect, useMemo, useState } from "react";
import Particles, {
  initParticlesEngine,
  type IParticlesProps,
} from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface ParticleLayoutPropType {
  children: React.ReactNode;
}

const ParticleLayout: React.FC<ParticleLayoutPropType> = ({ children }) => {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const options: IParticlesProps["options"] = useMemo(
    () => ({
      fullScreen: { enable: false, zIndex: -1 },
      fpsLimit: 120,
      particles: {
        number: {
          value: 220,
          density: {
            enable: true,
          },
        },
        color: {
          value: "#7E74F1",
        },
        opacity: {
          value: {
            min: 0.1,
            max: 0.6,
          },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        size: {
          value: {
            min: 3,
            max: 5,
          },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 50,
          color: "#7E74F1",
          opacity: 1,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          outModes: {
            default: "out",
          },
          attract: {
            enable: false,
            rotate: {
              x: 600,
              y: 1200,
            },
          },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          onClick: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          grab: {
            distance: 120,
            links: {
              opacity: 0.5,
            },
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return init ? (
    <div>
      <Particles options={options} />
      {children}
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default ParticleLayout;
