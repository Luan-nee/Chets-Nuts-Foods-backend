import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateSalidaTransporteDto } from "../../../domain/dto/salidaTransporte/createSalidaTransporte.dto.js";
import { SalidaTransporteUseCase } from "../../../domain/use-cases/salidaTransporte/salidaTrans.use-case.js";
import { emitRoomSocket } from "../../../controllerSockets/globalSocket.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { UpdateSalidaTransporteDto } from "../../../domain/dto/salidaTransporte/updateSalidaTransporte.dto.js";
import { UpdateSalidaTransUseCase } from "../../../domain/use-cases/salidaTransporte/updateSalidaTrans.use-case.js";

export class SalidaTransporteController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }
    const [error, salTransDTO] =
      CreateSalidaTransporteDto.createSalidaTransporte(req.body);

    if (error !== undefined || salTransDTO === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const salTransUse = new SalidaTransporteUseCase();

    salTransUse
      .create(salTransDTO)
      .then(async (data) => {
        await emitRoomSocket({
          data,
          req,
          response: "ESTABLECIMIENTO",
          valore: "newSalidaTransporte",
          codigo: data.origenEstablecimiento.idEst,
        });
        await emitRoomSocket({
          data,
          req,
          response: "ESTABLECIMIENTO",
          valore: "newSalidaTransporte",
          codigo: data.destinoEstablecimiento.idEst,
        });

        await emitRoomSocket({
          data,
          req,
          response: "ADMINS",
          valore: "newEstablecimiento",
        });

        CustomResponse.success({ res, data: "creado con exito" });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permiso para acceder aqui",
      });
      return;
    }

    const idEstablecimiento = req.authpayload.establecimiento;
    let idValor = 0;
    if (idEstablecimiento !== undefined) {
      idValor = idEstablecimiento;
    }

    const salTransUse = new SalidaTransporteUseCase();

    salTransUse
      .getSalidas(idValor)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getByID = (req: Request, res: Response) => {
    const [error, id] = NumericId.create(req.params);
    if (error !== undefined || id === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const getElement = new SalidaTransporteUseCase();

    getElement
      .getByID(id.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error2) => {
        CustomResponse.badRequest({ res, error: error2 });
      });
  };
  update = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [error, updateDto] = UpdateSalidaTransporteDto.createSalidaTransporte(
      req.body,
    );

    if (error !== undefined || updateDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const update = new UpdateSalidaTransUseCase();
    update
      .execute(updateDto)
      .then(async ({ data, update }) => {
        if (
          update.antiguoEstablecimientoDestino !== 0 &&
          update.nuevoEstablecimientoDestino !== 0
        ) {
          await emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "deleteSalidaTransporte",
            codigo: update.antiguoEstablecimientoDestino,
          });

          await emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "updateSalidaTransporte",
            codigo: update.nuevoEstablecimientoDestino,
          });
        }

        if (
          update.antiguoEstablecimientoIncio !== 0 &&
          update.nuevoEstablecimientoInicio !== 0
        ) {
          await emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "deleteSalidaTransporte",
            codigo: update.antiguoEstablecimientoIncio,
          });

          await emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "updateSalidaTransporte",
            codigo: update.nuevoEstablecimientoInicio,
          });
        }

        if (
          update.antiguoEstablecimientoDestino === 0 ||
          update.antiguoEstablecimientoIncio === 0
        ) {
          await emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "updateSalidaTransporte",
            codigo: data.origenEstablecimiento.idEst,
          });
          await emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "updateSalidaTransporte",
            codigo: data.destinoEstablecimiento.idEst,
          });
        }

        CustomResponse.success({ res, data: "Actualizado con exito" });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };
}
