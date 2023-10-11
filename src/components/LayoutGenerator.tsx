import { useState, useMemo, useCallback, useEffect, ChangeEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import { db } from "../../firebase-config";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { DeviceNames, batteries } from "../../devices";
import FormField from "./FormField";
import { EleCounts } from "../models/Layout";
import { genNodesForViz } from "../utils/genNodesForViz";
import Viz from "./Viz";
import { getBatteryCount } from "../utils/getBatteryCount";
import { getTransformerCount } from "../utils/getTransformerCount";
import { Specs } from "./Specs";
import { getScaledDimension } from "../utils/getScaledDimension";
import LegendItem from "./LegendItem";
import { scaleOrdinal } from "d3-scale";
import { schemePaired } from "d3-scale-chromatic";
import styles from "./LayoutGenerator.module.css";

interface LayoutDimensions {
  width: number;
  height: number;
}

const defaultEles = {
  megapackxl: 0,
  megapack2: 0,
  megapack: 0,
  powerpack: 0,
  transformer: 0,
};

const LayoutGenerator = () => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

  const [layoutDimensions, setLayoutDimensions] = useState<LayoutDimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const auth = firebase.auth();
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsub();
  }, []);

  const [eles, setEles] = useState<EleCounts<DeviceNames>>(defaultEles);

  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const totalBatteryCount = getBatteryCount(eles);

        if (totalBatteryCount) {
          setLayoutDimensions({
            width: getScaledDimension(node.clientWidth),
            height: getScaledDimension(node.scrollHeight),
          });
        } else {
          setLayoutDimensions({ width: 0, height: 0 });
        }
      }
    },
    [eles]
  );

  const handleInputChange = useCallback(
    (fieldName: DeviceNames) => (event: ChangeEvent<HTMLInputElement>) => {
      const result = parseInt(event.target.value, 10);
      setEles((prevEles) => {
        const nextEles = {
          ...prevEles,
          [fieldName]: isNaN(result) ? 0 : result,
        };
        const nextTransformerCount = getTransformerCount(
          getBatteryCount(nextEles)
        );
        return {
          ...nextEles,
          transformer: nextTransformerCount,
        };
      });
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

  const { totalCost, totalUsage } = useMemo(() => {
    return Object.values(batteries).reduce(
      (acc, { specs, meta }) => {
        const particularEleCount = eles[meta.id];
        return {
          totalCost: acc.totalCost + specs.cost * particularEleCount,
          totalUsage: acc.totalUsage + specs.energy * particularEleCount,
        };
      },
      { totalCost: 0, totalUsage: 0 }
    );
  }, [eles]);

  const data = useMemo(() => genNodesForViz(eles), [eles]);

  const names = data.children.map((d) => d.name);
  const color = scaleOrdinal(names, schemePaired);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl" disableGutters>
          <Toolbar className={styles.toolbar}>
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
      <Container className={styles.mainContainer} maxWidth="xl">
        <div className={styles.flexContainer}>
          <Card className={styles.cardContainer}>
            <CardContent>
              <div className={styles.cardContentContainer}>
                <Typography variant="h5" component="div">
                  Build of Materials
                </Typography>
                <IconButton color="primary" onClick={handleSave}>
                  <SaveIcon />
                </IconButton>
              </div>

              <div className={styles.flex}>
                {Object.values(batteries).map(({ meta, ui }) => (
                  <FormField
                    key={meta.id}
                    id={meta.id}
                    name={meta.name}
                    label={meta.label}
                    disabled={ui.input.disabled}
                    onChange={
                      ui.input.disabled ? undefined : handleInputChange(meta.id)
                    }
                    value={eles[meta.id] ?? 0}
                  />
                ))}
              </div>
              <Specs
                widthFt={layoutDimensions.width}
                heightFt={layoutDimensions.height}
                totalCost={totalCost}
                totalUsage={totalUsage}
              />
              <div className={styles.legendContainer}>
                {(Object.keys(eles) as Array<DeviceNames>).map((name) => (
                  <LegendItem
                    key={batteries[name].meta.label}
                    backgroundColor={color(name)}
                    name={batteries[name].meta.label}
                    count={eles[name]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          <div className={styles.vizContainer}>
            <Viz ref={gridRef} data={data} colorScale={color} />
          </div>
          <div className={styles.flex} />
        </div>
      </Container>
    </>
  );
};

export default LayoutGenerator;
