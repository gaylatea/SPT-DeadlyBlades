import { container, DependencyContainer, inject, injectable } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

@injectable()
class DeadlyBlades implements IPostDBLoadMod {
    constructor(
        @inject("DatabaseServer") protected dbServer: DatabaseServer,
        @inject("WinstonLogger") protected logger: ILogger,
    ) { }

    public postDBLoad(_container: DependencyContainer): void {
        const serverDB = this.dbServer.getTables();

        for(const item of Object.values(serverDB.templates.items)) {
            if(item._props.knifeHitSlashDam) {
                item._props.knifeHitSlashDam *= 10;
                item._props.knifeHitStabDam *= 10;
            }
        }

        this.logger.success("[DeadlyBlades] Melee weapons are now much more deadly.");
    }
}

container.registerSingleton(DeadlyBlades);
export const mod = container.resolve(DeadlyBlades);