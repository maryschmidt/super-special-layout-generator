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
        <Box
          display="flex"
          flex="1"
          padding={2}
          overflow="hidden"
          alignItems="flex-start"
        >
          <Card
            sx={{ marginRight: 2, flex: "0 0 360px", alignSelf: "flex-start" }}
          >
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
              </Box>
              <Specs
                widthFt={layoutDimensions.width}
                heightFt={layoutDimensions.height}
                totalCost={totalCost}
                totalUsage={totalUsage}
              />
            </CardContent>
          </Card>
          <Box
            flexGrow="0"
            flexShrink="0"
            flexBasis="fit-content"
            maxHeight="100%"
            width="100%"
            style={{ overflowY: "auto", overflowX: "hidden" }}
          >
            <Box display="flex" marginBottom={1}>
              {(Object.keys(eles) as Array<DeviceNames>).map((name) => (
                <LegendItem
                  key={batteries[name].meta.label}
                  backgroundColor={color(name)}
                  name={batteries[name].meta.label}
                  count={eles[name]}
                />
              ))}
            </Box>
            <Box ref={gridRef}>
              <Viz data={data} colorScale={color} />
            </Box>
          </Box>
          <Box flex="1" />
        </Box>
      </Container>
    </>
  );
};

export default LayoutGenerator;
