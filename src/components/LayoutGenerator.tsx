import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  ChangeEvent,
} from "react";
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
import { TEN } from "../utils/getFtToPxConversionFactor";
import { EleCounts } from "../models/Layout";
import { genNodesForViz } from "../utils/genNodesForViz";
import Viz from "./Viz";

const defaultEles = {
  megapackxl: 0,
  megapack2: 0,
  megapack: 0,
  powerpack: 0,
  transformer: 0,
};

const LayoutGenerator = () => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  // TODO move utils to their own files
  // getBatteryCount()
  // getTransformerCount()
  const handleInputChange = useCallback(
    (fieldName: DeviceNames) => (event: ChangeEvent<HTMLInputElement>) => {
      const result = parseInt(event.target.value, 10);
      setEles((prevEles) => {
        const nextEles = {
          ...prevEles,
          [fieldName]: isNaN(result) ? 0 : result,
        };
        const nextBatteryCount = (Object.keys(nextEles) as Array<DeviceNames>)
          .filter((k) => k !== "transformer") // We only want the batteries
          .reduce((acc, cur) => acc + nextEles[cur], 0);
        const nextTransformerCount = Math.ceil(nextBatteryCount / 2);
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

  const widthFt = Math.round((gridRef?.current?.scrollWidth ?? 0) / TEN);
  const heightFt = Math.round((gridRef?.current?.scrollHeight ?? 0) / TEN);

  const data = genNodesForViz(eles);

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
              <Box display="flex" flexWrap="wrap">
                <Box flex="1">
                  <Typography variant="caption">Width</Typography>
                  <Typography variant="body1">{`${widthFt} ft`}</Typography>
                </Box>
                <Box flex="1">
                  <Typography variant="caption">Height</Typography>
                  <Typography variant="body1">{`${heightFt} ft`}</Typography>
                </Box>
                <Box flex="1">
                  <Typography variant="caption">Cost</Typography>
                  <Typography variant="body1">{`$${
                    totalCost / 1000
                  }k`}</Typography>
                </Box>
                <Box flex="1">
                  <Typography variant="caption">Energy</Typography>
                  <Typography variant="body1">{`${totalUsage} MWh`}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Box
            ref={gridRef}
            flexGrow="0"
            flexShrink="0"
            flexBasis="fit-content"
            maxHeight="100%"
            width="100%"
            style={{ overflowY: "auto", overflowX: "hidden" }}
          >
            <Viz data={data} />
          </Box>
          <Box flex="1" />
        </Box>
      </Container>
    </>
  );
};

export default LayoutGenerator;
