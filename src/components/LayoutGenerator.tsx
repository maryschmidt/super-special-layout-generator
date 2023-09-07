import { useState, useMemo, useCallback, useEffect, ChangeEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import "./LayoutGenerator.css";
import { db } from "../../firebase-config";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { devices } from "../../devices";
import Transformers from "./Transformers";
import FormField from "./FormField";

const mapEleToCssClass = (eleName: keyof typeof EleNames): string => {
  if (eleName === "megapackxl") {
    return "forty";
  } else if (eleName === "megapack2" || eleName === "megapack") {
    return "thirty";
  } else if (eleName === "powerpack") {
    return "ten";
  }
  return ""; // Unknown elements
};

/**
 * Note: 100px is the magic column number here (see CSS file)
 * 100px corresponds to 10ft in width
 * The max width is 100ft, or 1000px
 */

interface LayoutDimensions {
  width: number;
  height: number;
}

enum EleNames {
  megapackxl,
  megapack2,
  megapack,
  powerpack,
}

type EleCounts = {
  [s in keyof typeof EleNames]: number;
};

const defaultEles = {
  megapackxl: 0,
  megapack2: 0,
  megapack: 0,
  powerpack: 0,
};

const LayoutGenerator = () => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const auth = firebase.auth();
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsub();
  }, []);

  const [eles, setEles] = useState<EleCounts>(defaultEles);

  const [layoutDimensions, setLayoutDimensions] = useState<LayoutDimensions>({
    width: 0,
    height: 0,
  });

  const totalEleCount = useMemo(
    () => Object.values(eles).reduce((acc, cur) => acc + cur, 0),
    [eles]
  );

  const transformerCount = useMemo(() => {
    return Math.ceil(totalEleCount / 2);
  }, [totalEleCount]);

  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        if (totalEleCount) {
          setLayoutDimensions({
            width: node.clientWidth / 10,
            height: (node.scrollTop + node.scrollHeight) / 10,
          });
        } else {
          setLayoutDimensions({ width: 0, height: 0 });
        }
      }
    },
    [totalEleCount]
  );

  const handleInputChange = useCallback(
    (fieldName: keyof typeof EleNames) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const result = parseInt(event.target.value, 10);
        setEles((prevEles) => ({
          ...prevEles,
          [fieldName]: isNaN(result) ? 0 : result,
        }));
      },
    [setEles]
  );

  const handleSave = useCallback(() => {
    if (currentUser) {
      db.ref(`users/${currentUser.uid}`)
        .set(eles)
        .catch(() => console.log("save failed"));
    }
  }, [eles, currentUser]);

  // TODO Add UX for error handling
  useEffect(() => {
    if (currentUser) {
      db.ref(`users/${currentUser.uid}`)
        .once("value")
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            setEles(data);
          }
        })
        .catch(() => "read failed");
    }
  }, [currentUser, setEles]);

  const [totalCost, totalUsage] = useMemo(() => {
    const { eleCost, eleUsage } = (
      Object.keys(eles) as Array<keyof typeof EleNames>
    ).reduce(
      (acc, eleName) => {
        const particularEleCount = eles[eleName];
        return {
          eleCost: acc.eleCost + devices[eleName].cost * particularEleCount,
          eleUsage: acc.eleUsage + devices[eleName].energy * particularEleCount,
        };
      },
      { eleCost: 0, eleUsage: 0 }
    );
    const transformerCost = devices.transformer.cost * transformerCount;
    const transformerUsage = devices.transformer.energy * transformerCount;
    const c = eleCost + transformerCost;
    const u = eleUsage + transformerUsage;
    return [c, u];
  }, [eles, transformerCount]);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap>
              Super Special Layout Generator
            </Typography>
            <Avatar
              alt={currentUser?.displayName ?? undefined}
              src={currentUser?.photoURL ?? undefined}
            />
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Box display="flex" padding={2} overflow="hidden">
          <Card sx={{ marginRight: 2, flex: 1, alignSelf: "flex-start" }}>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5" component="div">
                  Build of Materials
                </Typography>
                <IconButton color="primary" onClick={handleSave}>
                  <SaveIcon />
                </IconButton>
              </Box>

              <Box flex="1">
                <FormField
                  id="megapackxl"
                  name="megapackxl"
                  label="MegapackXL"
                  onChange={handleInputChange("megapackxl")}
                  value={eles.megapackxl}
                />
                <FormField
                  id="megapack2"
                  name="megapack2"
                  label="Megapack2"
                  onChange={handleInputChange("megapack2")}
                  value={eles.megapack2}
                />
                <FormField
                  id="megapack"
                  name="megapack"
                  label="Megapack"
                  onChange={handleInputChange("megapack")}
                  value={eles.megapack}
                />
                <FormField
                  id="powerpack"
                  name="powerpack"
                  label="Powerpack"
                  onChange={handleInputChange("powerpack")}
                  value={eles.powerpack}
                />
                <FormField
                  id="transformer"
                  name="transformer"
                  label="Transformer"
                  disabled
                  value={transformerCount}
                />
              </Box>
              <Box display="flex" flexWrap="wrap">
                <Box flex="1">
                  <Typography variant="caption">Width</Typography>
                  <Typography variant="body1">{`${layoutDimensions.width} ft`}</Typography>
                </Box>
                <Box flex="1">
                  <Typography variant="caption">Height</Typography>
                  <Typography variant="body1">{`${layoutDimensions.height} ft`}</Typography>
                </Box>
                <Box flex="1">
                  <Typography variant="caption">Cost</Typography>
                  <Typography variant="body1">{`$${totalCost}`}</Typography>
                </Box>
                <Box flex="1">
                  <Typography variant="caption">Energy</Typography>
                  <Typography variant="body1">{`${totalUsage} MWh`}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <div className="grid" ref={gridRef}>
            {(Object.keys(eles) as Array<keyof typeof EleNames>).map((ele) => {
              const cssClassName = mapEleToCssClass(ele);
              const devices: Array<string> = [];
              for (let i = 0; i < eles[ele]; i++) {
                devices.push(cssClassName);
              }
              return devices.map((d, k) => (
                <div key={`device-${k}`} className={d} />
              ));
            })}
            <Transformers count={transformerCount} />
          </div>
        </Box>
      </Container>
    </>
  );
};

export default LayoutGenerator;
