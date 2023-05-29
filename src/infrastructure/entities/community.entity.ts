import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'communities' })
export class CommunityEntity {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true, index: { unique: true } })
  slug: string;

  @Prop({ required: true, unique: true, index: { unique: false } })
  name: string;

  @Prop({
    index: false,
    required: false,
    unique: false,
    default:
      'https://www.google.com/url?sa=i&url=https%3A%2F%2Fseeklogo.com%2Fvector-logo%2F186446%2Funiversidad-de-sevilla&psig=AOvVaw3MCiPC0qqY6x7ykEgETio1&ust=1685120723667000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCID7gYr6kP8CFQAAAAAdAAAAABAh',
  })
  icon: string;
}

export const CommunitySchema = SchemaFactory.createForClass(CommunityEntity);
