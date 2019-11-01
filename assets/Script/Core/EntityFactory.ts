import Logger from "../Utils/Logger";
import Entity from "./Entity";
import { EnumEntity } from "../Game/Enum/EnumEntity";

// 实体工厂

export default class EntityFactory {

    private entityParts: Object = {};
    // 自增的entityID
    private entityId: number = 0;

    register(entityType: any, partEnums: any) {
        if (this.entityParts.hasOwnProperty(entityType)) {
            Logger.error("entity " + entityType + "is already registered!")
            return;
        }
        this.entityParts[entityType] = partEnums;
    }

    unregister(entityType: any) {
        if (this.entityParts.hasOwnProperty(entityType)) {
            delete this.entityParts[entityType];
        }
    }

    createEntity(entityType: any = EnumEntity.None): Entity {
        let id = this.genEntityId();
        let entity = new Entity(id);
        if (entityType != EnumEntity.None) {
            this.initParts(entity, entityType);
        }
        return entity;
    }

    initParts(entity: Entity, entityType: any) {
        if (this.entityParts.hasOwnProperty(entityType)) {
            let partEnums = this.entityParts[entityType]
            if (partEnums) {
                partEnums.forEach(partEnum => {
                    entity.addPart(partEnum)
                });
            }
        }
    }

    genEntityId() {
        this.entityId = this.entityId + 1;
        return this.entityId;
    }

}